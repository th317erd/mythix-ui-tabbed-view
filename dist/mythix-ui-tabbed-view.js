import { MythixUIComponent, Utils } from 'mythix-ui-core';

export default class MythixUITabbedView extends MythixUIComponent {
  static tagName = 'mythix-tabbed-view';

  mounted() {
  }

  $pages() {
    return this.$('section[name]');
  }

  $tabs() {
    return this.$('nav .tab');
  }

  rebuildTabs() {
    let $nav = this.$('nav')[0];
    if (!$nav)
      return;

    // Ensure a page is active
    let pages     = this.$pages();
    let anyActive = pages.some((element) => element.classList.contains('active'));
    if (!anyActive)
      pages.first().addClass('active');

    let sortDirection = 1;
    let sortKey       = this.getAttribute('sort');
    if (sortKey) {
      sortKey = sortKey.replace(/^[+-]+/, (m) => {
        if (m.charAt(0) === '-')
          sortDirection = -1;

        return '';
      });

      pages = pages.sort((a, b) => {
        let x = Utils.fetch(a, sortKey, a.getAttribute('title') || a.getAttribute('name'));
        let y = Utils.fetch(b, sortKey, b.getAttribute('title') || b.getAttribute('name'));

        // eslint-disable-next-line eqeqeq
        if (x == y)
          return 0;

        return ((x < y) ? -1 : 1) * sortDirection;
      });
    }

    pages.map((pageElement, index) => {
      let isActive  = pageElement.classList.contains('active');
      let pageName  = pageElement.getAttribute('name');

      return this.build(({ BUTTON, SPAN, SLOT }) => {
        return BUTTON
          .class(this.classes('tab', { active: isActive }))
          .onClick(this.onTabClicked.bind(this, pageName))
          .dataFor(pageName)
          .tabIndex(index)(
            SLOT.name(pageName)(
              SPAN.class('tab-title')(pageElement.getAttribute('title') || `Page ${index + 1}`),
            ),
          );
      });
    }).replaceChildrenOf($nav);
  }

  onTabClicked(pageName, event) {
    event.stopPropagation();

    this.$pages().removeClass('active').$(`section[name="${pageName}"]`).addClass('active');
    this.$tabs().removeClass('active').$(`.tab[data-for="${pageName}"]`).addClass('active');
  }

  onSlotChange() {
    this.rebuildTabs();
  }
}

MythixUITabbedView.register();
