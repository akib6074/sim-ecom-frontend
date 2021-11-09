import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  Router,
} from '@angular/router';
import { LoaderService } from '../../core/services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewChecked {
  constructor(
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public loaderService: LoaderService,
    private readonly cdRef: ChangeDetectorRef
  ) {
    router.events.subscribe((routerEvent: Event) => {
      this.checkRouterEvent(routerEvent);
    });
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  checkRouterEvent(routerEvent: Event): void {
    if (
      routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError
    ) {
      /******************* set title *********************/
      const title = new Set();
      title.add('EBONEAR');
      let child = this.activatedRoute.firstChild;
      while (child) {
        if (child?.snapshot?.data.title) {
          title.add(child?.snapshot?.data.title);
        }
        child = child?.firstChild;
      }

      const toSkip = ['/', '/product'];
      if (!toSkip.includes(this.router.url)) {
        window.scrollTo(0, 0);
      }
      this.titleService.setTitle(Array.from(title).join(':'));
    }
  }
}
