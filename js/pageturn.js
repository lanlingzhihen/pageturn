/**
 * Created by zhangxiaopeng on 2016/3/16.
 */
//页面滑屏组件
var slider = {
    init: function(hook) {
        var el = $('#pages')[0];
        ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'mousedown', 'mousemove', 'mouseup'].forEach(function(ev) {
            el.addEventListener(ev, this, false)
        }.bind(this))

        this.threshold = 50
        this.hook = hook;
        /*this.sliding=false;*/

        $('.page').each(function(i, item) {
            if (i == 0) {
                $(item).addClass('current')
                this.curPage = item
            } else {
                item.style.webkitTransform = 'translate3d(0, 100%, 0)'
            }
        }.bind(this))
    },
    handleEvent: function(ev) {
        switch (ev.type) {
            case 'touchstart':
            case 'mousedown':
                this.start(ev)
                break
            case 'touchmove':
            case 'mousemove':
                this.move(ev)
                break
            case 'touchend':
            case 'touchcancel':
            case 'mouseup':
                this.end(ev)
        }
    },
    start: function(ev) {
        if (this.sliding)
            return

        var touch  = ev.touches ? ev.touches[0] : ev
        this.pageX = touch.pageX
        this.pageY = touch.pageY
    },
    move: function(ev) {
        ev.preventDefault()

        if (this.sliding)
            return

        var touch  = ev.touches ? ev.touches[0] : ev
        this.distX = touch.pageX - this.pageX
        this.distY = touch.pageY - this.pageY
    },
    end: function() {
        if (this.sliding)
            return

        var prevPage = this.curPage.previousElementSibling,
            nextPage = this.curPage.nextElementSibling;
        if (prevPage && this.distY > this.threshold && this.hook.shouldGoToPrev(this.curPage)) {
            this.prev(prevPage)
        } else if (nextPage && this.distY < -this.threshold && this.hook.shouldGoToNext(this.curPage)) {
            this.next(nextPage)
        }

        this.pageX = this.pageY = this.distX = this.distY = undefined
    },
    prev: function(el) {
        this.turn(el, true)
    },
    next: function(el) {
        this.turn(el, false)
    },
    turn: function(el, prev) {
        el.style.webkitTransform = prev ? 'translate3d(0, -100%, 0)' : 'translate3d(0, 100%, 0)'
        el.style.zIndex = 10
        el.style.webkitTransition = 'all 0.5s'
        this.curPage.style.webkitTransition = 'all 0.5s'

        $(el).one('webkitTransitionEnd', function() {
            el.style.webkitTransition = ''
            this.curPage.style.webkitTransition = ''
            this.curPage.style.zIndex = ''

            $(this.curPage).removeClass('current')
            $(el).addClass('current')

            this.hook.didGoToPage(el, this.curPage)
            this.curPage = el
            this.sliding = false
        }.bind(this))

        setTimeout(function() {
            this.sliding = true
            el.style.webkitTransform = 'translate3d(0, 0, 0)'
            this.curPage.style.webkitTransform = prev ? 'translate3d(0, 100%, 0)' : 'translate3d(0, -100%, 0)'
        }.bind(this), 20)
    }
}

//页面逻辑控制器
var pageController = {
    shouldGoToPrev: function(el) {
        /*
        if ($(el).hasClass('p7')) {
            return false
        }
        return true*/
        return true
    },
    shouldGoToNext: function(el) {
        /*
        if ($(el).hasClass('p1') || $(el).hasClass('p6')) {
            return false
        }*/
        return true
    },
    didGoToPage: function(el, prevEl) {
        // console.log('didGoToPage', el.className)
    }
}
window.onload=function(){
    slider.init(pageController);
}