const support = require('../support');
const {v4} = require('uuid');
const router = support.app().lib.router;
const url  = require('url');

describe('Router Tests', ()=>{
    // Guest
    class ExampleController{
        constructor(...attrs){
            const [req, res, params, action] = attrs;
    
            this.req = req;
            this.res = res;
            this.params = params || {};
            this.action = action;
            this.headers = this.req.headers
            this.url = url.parse(req.url, true);
            this.params = {
                ...this.params,
                ...(req.body || {}),
                ...this.url.query
            }
        }
        before(){
            return true
        }
    }
    
    const req = (options = {})=>(
        {
            url: 'http://localhost/test',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8',
                'User-Agent': 'my-client'
            },
            ...options
        }
    )
    
    test('Router', async() => {
        router.routes((r)=>{
            class Test extends ExampleController {
                before(){
                    return true
                }
                index(){
                    this.res.end()
                }
            }
            r.resource('/test', Test, ['index'])
        })
        
        let testA = false;
    
        await new Promise((resolve, reject)=>{
            const res = {
                end: ()=>{
                    testA = true
                    resolve()
                }
            }
            router.lookup(req(), res)
        })
    
    
        expect(
            testA
        ).toBeTruthy();
    });
})