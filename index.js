(function(){

  'use strict';

  function toHalfWidth(str) {
    var code = str.charCodeAt(0) - 0xFEE0;

    return String.fromCharCode(code);
  }

  function toFullWidth(str) {
    var code = str.charCodeAt(0) + 0xFEE0;

    return String.fromCharCode(code);
  }

  //----------------------------------------------------------------------------

  // base code from:
  //   http://stackoverflow.com/questions/26263169/how-to-retain-cursor-position-when-updating-a-knockout-js-observable-in-an-exten
  function getCaretPosition(element) {
    var caretPos = 0,
        sel;

    if (!!document.selection) {
      // for IE
      element.focus();

      sel = document.selection.createRange();
      sel.moveStart('character', -element.value.length);

      caretPos = sel.text.length;
    } else if (!!element.selectionStart || element.selectionStart === 0) {
      // for modern browsers
      caretPos = element.selectionStart;
    }

    return caretPos;
  }

  // base code from:
  //   http://stackoverflow.com/questions/26263169/how-to-retain-cursor-position-when-updating-a-knockout-js-observable-in-an-exten
  function setCaretPosition(element, caretPos) {
    var range;

    if (!!element.createTextRange) {
      // for IE
      range = element.createTextRange();
      range.move('character', caretPos);
      range.select();
    } else {
      // for modern browsers
      element.focus();

      if (!!element.selectionStart) {
        element.setSelectionRange(caretPos, caretPos);
      }
    }
  }

  //----------------------------------------------------------------------------

  ko.extenders.change = function(target, options) {
    var result = ko.pureComputed({
      read: target,
      write: function(newValue) {
        options.callback(target, newValue);
      }
    }).extend({
      notify: 'always'
    });

    return result;
  };

  ko.applyBindings({

    //toHalfWidthText: ko.observable('').extend({
    //  change: {
    //    callback: function(target, newValue) {
    //      if (newValue === '') {
    //        target('');
    //      } else {
    //        target(newValue.replace(/[\uFF01-\uFF5E]/g, toHalfWidth));
    //      }
    //    }
    //  }
    //}),

    toFullWidthText: ko.observable('').extend({
      change: {
        callback: function(target, newValue) {
          if (newValue === '') {
            target('');
          } else {
            target(newValue.replace(/[\u0021-\u007E]/g, toFullWidth));
          }
        }
      }
    })

  });

  $('#to-half-width-input').on('blur keyup select', $.debounce(500, function(event) {
    console.log(event);

    var input = $('#to-half-width-input'),
        pos = getCaretPosition(input.get(0)),
        text = input.val();

    input.val(text.replace(/[\uFF01-\uFF5E]/g, toHalfWidth));

    if (event.type !== 'blur' && event.type !== 'select') {
      setCaretPosition(input.get(0), pos);
    }
  }));

}());
