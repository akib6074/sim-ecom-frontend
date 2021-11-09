import { MicroserviceURL } from './../../../../../core/enum/microservices.enum';
import { TokenStorageService } from './../../../../../core/services/token-storage.service';
import { ApiConfigService } from './../../../../../core/services/api-config.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { OrderService } from '../../order.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
  invoiceDetails: any;
  subTotal = 0;
  totalVat = 0;
  totalDiscount = 0;
  shippingCharge = 40;
  totalAdditionalShippingCharge = 0;
  grandTotal = 0;
  orderDetails: any[];
  transMaster: any = {};
  companyInfo: any = {};

  paymentUrl = this.apiConfigService.getUrl(MicroserviceURL.PAYMENT);

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly activateRoute: ActivatedRoute,
    private tokenStorageService: TokenStorageService,
    public datePipe: DatePipe,
    private readonly orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.invoiceData();
    this.transMaster = this.activateRoute.snapshot.data?.transMaster;
    this.companyInfo = this.tokenStorageService.getCompanyInfo();

    new Promise((resolve) => {
      // this.initSslCommerze();
      resolve(true);
    })
      .then(() => {})
      .catch(() => {});
  }

  initSslCommerze = () => {
    const sslBtn: any = document.getElementById('sslczPayBtn');
    sslBtn?.setAttribute('token', this.tokenStorageService.getToken());
    sslBtn?.setAttribute('order', this.transMaster?.id);
    sslBtn?.setAttribute('postdata', {});
    sslBtn?.setAttribute('endpoint', this.paymentUrl + 'ssl-commerze/prepare');
    const script: any = document.createElement('script');
    const tag = document.getElementsByTagName('script')[0];
    script.src =
      this.apiConfigService.getPaymentMerchantApi() +
      Math.random().toString(36).substring(7);
    tag.parentNode?.insertBefore(script, tag);
  };


  getDescription = (): string => {
    if (this.transMaster?.invoice?.invoiceDetail?.job) {
      return this.transMaster?.invoice?.invoiceDetail?.job.designation;
    } else {
      return this.transMaster?.invoice?.invoiceDetail?.property.title;
    }
  };

  public convertToPDF = () => {
    const data: any = document.getElementById('contentToConvert');
    html2canvas(data, {
      scrollY: -window.scrollY,
      scale: 1,
    }).then((canvas) => {
      // Few necessary setting options
      console.log(canvas);
      const imgWidth = 220;

      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const heightLeft = imgHeight;
      console.log(imgWidth, imgHeight);

      const contentDataURL = canvas.toDataURL('image/png');
      console.log(contentDataURL);
      const pdf = new jspdf('p', 'mm', 'a4');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      const pdfName: string = this.transMaster?.invoice?.dateApplied;
      // @ts-ignore
      pdf.save(this.datePipe.transform(pdfName, 'YYYY-MM-dd'));
    });
  };

  invoiceData = () => {
    this.activateRoute.params.subscribe((data) => {
      this.orderService.findByID(data?.orderId).subscribe((res) => {
        this.invoiceDetails = res?.payload?.data;
        this.orderDetails = this.invoiceDetails.orderDetails;
        console.log(this.invoiceDetails);
        for (const total of this.orderDetails) {
          this.subTotal = this.subTotal + total.price * total.quantity;
          this.totalDiscount =
            this.totalDiscount + total.quantity * total.product.discount;
          this.totalAdditionalShippingCharge =
            this.totalAdditionalShippingCharge +
            total.product.additionalShippingCost;
        }
        this.grandTotal =
          this.subTotal +
          this.totalAdditionalShippingCharge +
          this.shippingCharge +
          this.totalVat -
          this.totalDiscount;
      });
    });
  };
}
