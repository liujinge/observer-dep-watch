// Observer
class Observer {
    constructor (data) {
        this.walk(data)
    }
    walk (data) {
        // 遍历 data 对象属性，调用 defineReactive 方法
        let keys = Object.keys(data)
        for(let i = 0; i < keys.length; i++){
            defineReactive(data, keys[i], data[keys[i]])
        }
    }
}

// defineReactive方法将data的属性转换为访问器属性
function defineReactive (data, key, val) {

    // 递归观测子属性
    observer(val)
    
    let dep = new Dep()
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            dep.depend()
            return val
        },
        set: function (newVal) {
            if(val === newVal){
                return
            }
            
            // 对新值进行观测
            observer(newVal)
            dep.notify()
        }
    })
}

// observer 方法首先判断data是不是纯JavaScript对象，如果是，调用 Observer 类进行观测
function observer (data) {
    if(Object.prototype.toString.call(data) !== '[object Object]') {
        return
    }
    new Observer(data)
}

class Dep {
    constructor () {
        this.subs = []
    }
    depend () {
        this.subs.push(Dep.target)
    }
    notify () {
        for(let i = 0; i < this.subs.length; i++){
            this.subs[i].fn()
        }
    }
}

Dep.target = null

function pushTarget(watch){
    Dep.target = watch
}

// watch
class Watch {
    constructor (exp, fn) {
        this.exp = exp
        this.fn = fn
        pushTarget(this)
        data[exp]
    }
}


var data = {
    a: 1,
    b: {
        c: 2
    }
}

observer(data)

new Watch('a', () => {
    console.log(9)
})

new Watch('b.c', () => {
    console.log(80)
})
