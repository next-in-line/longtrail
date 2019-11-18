const router = require('find-my-way')
const _ = require('lodash')

module.exports = {
    createRouterBase: (base)=>{
        const r = router(base.config.router || {})
        
        const processController = async (Controller, args, action)=>{
            const controller = new Controller(...args);
            controller.action = action;
            
            if(await controller.before()){
                controller[action]()
            }else{
                if(_.get(base, 'config.controller.logging', true)){
                    console.log('Controller Rejected request')
                    console.log('----------------------------------');
                }
            }
        }
    
        const _r = {
            fmw: r,
            get: (url, controller, action)=>{
                r.get(url, (...args)=>{
                    if(!action && _route.match(/\//).length == 1) action = _route.slice(1, _route.length)
                    return processController(controller, args, action)
                })
            },
            put: (url, controller, action)=>{
                r.put(url, (...args)=>{
                    if(!action && _route.match(/\//).length == 1) action = _route.slice(1, _route.length)
                    return processController(controller, args, action)
                })
            },
            post: (url, controller, action)=>{
                r.post(url, (...args)=>{
                    if(!action && _route.match(/\//).length == 1) action = _route.slice(1, _route.length)
                    return processController(controller, args, action)
                })
            },
            delete: (url, controller, actions)=>{
                r.delete(url, (...args)=>{
                    if(!action && _route.match(/\//).length == 1) action = _route.slice(1, _route.length)
                    return processController(controller, args, action)
                })
            },
        };
    
        _r.scope = (route, cb)=>{
            if(route[0] !== '/') route = `/${route}`
    
            const all = (type, _route, controller, action)=>{
                if(_route[0] != '/') `/${route}`;
    
                if(!action && _route.includes('/')) action = _route.slice(1, _route.length)
                
                r[type](`${route}${_route}`, (...args)=>{
                    return processController(controller, args, action)
                })    
            }
            
            cb({
                get: (...attrs)=>{
                    all('get', ...attrs)
                },
                put: (...attrs)=>{
                    all('put', ...attrs)
                },
                post: (...attrs)=>{
                    all('post', ...attrs)
                },
                delete: (...attrs)=>{
                    all('delete', ...attrs)
                },
            })
        }
        _r.resource = (route, controller, actions = ['show', 'index', 'create', 'update', 'destroy'], cb = ()=>{})=>{
            if(route[0] !== '/') route = `/${route}`
            
            if(typeof actions == 'function'){
                cb = actions
                actions = ['show', 'index', 'create', 'update', 'destroy']
            }
            
    
            if(actions.includes('show')){
                r.get(route + '/:id', (...args)=>{
                    return processController(controller, args, 'show')
                })
            }
            
            if(actions.includes('index')){
                r.get(route, (...args)=>{
                    return processController(controller, args, 'index')
                })
            }
            
            if(actions.includes('create')){
                r.post(route, (...args)=>{
                    return processController(controller, args, 'create')
                })
            }
            
            if(actions.includes('update')){
                r.put(route + '/:id', (...args)=>{
                    return processController(controller, args, 'update')
                })
            }
            
            if(actions.includes('destroy')){
                r.delete(route + '/:id', (...args)=>{
                    return processController(controller, args, 'destroy')
                })
            }
    
    
            const all = (type, _route, controller, action)=>{
                if(_route[0] != '/') `/${route}`;
    
                if(!action && _route.includes('/')) action = _route.slice(1, _route.length)
                
                r[type](`${route}${_route}`, (...args)=>{
                    return processController(controller, args, action)
                })
            }
    
            if(route[0] !== '/') route = `/${route}`
    
            cb({
                get: (...attrs)=>{
                    all('get', ...attrs)
                },
                put: (...attrs)=>{
                    all('put', ...attrs)
                },
                post: (...attrs)=>{
                    all('post', ...attrs)
                },
                delete: (...attrs)=>{
                    all('delete', ...attrs)
                },
            })
        }
        _r.routes = function(cb){
            cb(_r)
        }
        _r.lookup = (...attrs)=>{
            r.lookup(...attrs)
        }
        return _r;
    }
}