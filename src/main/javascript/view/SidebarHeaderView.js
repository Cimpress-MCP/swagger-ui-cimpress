'use strict';

SwaggerUi.Views.SidebarHeaderView = Backbone.View.extend({
  initialize: function (opts) {
    this.options = opts || {};
    this.router = this.options.router;
  },

  events: {
    'click [data-endpoint]': 'clickSidebarItem'
  },

  render: function () {
    $(this.el).html(Handlebars.templates.sidebar_header(this.model));

    for (var i = 0; i < this.model.operationsArray.length; i++) {
      var item = this.model.operationsArray[i].operation;
      item.nickname = this.model.operationsArray[i].nickname;
      item.parentId = this.model.operation.parentId;

      // @theopak 2016-03-15
      item.method = this.model.operationsArray[i].method;
      item.deprecated = this.model.operationsArray[i].deprecated;
      item.encodedParentId = encodeURIComponent(this.parentId);
      item.path = this.model.operationsArray[i].path;

      this.addSidebarItem(item, i);
    }

    return this;
  },

  addSidebarItem: function (item) {
    var sidebarItemView = new SwaggerUi.Views.SidebarItemView({
      model: item,
      tagName: 'div',
      className : 'item',
      attributes: {
          'data-endpoint': item.parentId + '_' + item.nickname
      },
      router: this.router,
      swaggerOptions: this.options.swaggerOptions
    });
    $(this.el).append(sidebarItemView.render().el);
  },

  clickSidebarItem: function (e) {

    /* @theopak 2016-05-11 NG-4302 */
    // console.info(e);
    var candidateElement = e.target;
    while (candidateElement.parentNode && !candidateElement.hasAttribute('data-endpoint')) {
      candidateElement = candidateElement.parentNode;
      // console.info('.');
    }
    var elem = $(candidateElement);
    var eln = $('#' + elem.attr('data-endpoint'));

    if (elem.is('.item')) {
      scroll(elem.attr('data-endpoint'));
      setSelected(elem);
      updateUrl(eln.find('.path a').first().attr('href'));
    }

    /* scroll */
    function scroll(elem) {
      var i = $('.sticky-nav').outerHeight();
      var r = $('#' + elem).offset().top - i - 10;
      if(matchMedia()) {
        (r = $('#' + elem).offset().top - 10);
      }
      scrollT(r);
    }

    /* set selected value and select operation (class) */
    function setSelected(element) {
      var nav = $('.sticky-nav [data-navigator]');
      {
        $('#' + element.attr('data-endpoint'));
      }
      nav.find('[data-resource]').removeClass('active');
      nav.find('[data-selected]').removeAttr('data-selected');
      element.closest('[data-resource]').addClass('active');
      element.attr('data-selected', '');
      $('.sticky-nav').find('[data-selected-value]').html(element.text());
    }

    /* update navigation */
    function updateUrl(/* element */) {
      // HACK @theopak 2015-12-30 Commented out bc this is a horrible thing to do
      // history.pushState && history.pushState(null, null, element)
    }

    function matchMedia() {
      return window.matchMedia('(min-width: 992px)').matches;
    }

    function scrollT(e) {
      if ('self' === e) {
        var n = $(window).scrollTop();
        return $(window).scrollTop(n);
      }

      return $(window).scrollTop(e);
    }
  }

});
