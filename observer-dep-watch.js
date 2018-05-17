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
    
    // data中的每个字段都有一个 Dep实例
    // 在 get 中收集仅针对该属性的依赖
    // 在 set 中触发所有收集到的依赖
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


// Dep
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

// 将当前 Watch实例 设置为全局属性
Dep.target = null

function pushTarget(watch){
    Dep.target = watch
}


// Watch
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

// a 收集到的第一个依赖（Watch 对象）
new Watch('a', () => {
    console.log(9)
})

// a 收集到的第二个依赖（Watch 对象）
new Watch('a', () => {
    console.log(99)
})

// 当 a 属性值变化的时候，就会通过 dep.notify 循环调用所有收集到的Watch对象中的回调函数

// b.c 收集到的第一个依赖（Watch 对象）
new Watch('b.c', () => {
    console.log(80)
})
