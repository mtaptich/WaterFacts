var app = angular.module('Waterapp', ['ngDropdowns', 'ui.bootstrap'])

// Text environment function
app.directive('evt', function() {
  function link(scope, el, attr) {
    var label = attr.label
    var bg = attr.bg
    scope.labelstyle = { backgroundColor: bg }
    scope.label = attr.label
  }
  return {
    link: link,
    scope: {},
    restrict: 'E',
    template: function(elem, attr){
        return '<div ng-style="labelstyle">{{label}}</div>'
    }
  }
})

app.directive('backImg', function(){
    return function(scope, element, attrs){
        var url = attrs.backImg;
        element.css({
            'background-image': 'url(' + url +')',
            'background-size' : 'cover'
        });
    };
});

app.directive("popoverHtmlUnsafePopup", function () {
      return {
        restrict: "EA",
        replace: true,
        scope: { title: "@", content: "@", placement: "@", animation: "&", isOpen: "&" },
        templateUrl: "popover-html-unsafe-popup.html"
      };
    })

    .directive("popoverHtmlUnsafe", [ "$tooltip", function ($tooltip) {
      return $tooltip("popoverHtmlUnsafe", "popover", "mouseenter");
    }]);
