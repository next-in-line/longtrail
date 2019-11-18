const mailgun = require('mailgun-js');
let _plivo = require('plivo');
const fs = require('fs')
const moment = require('moment')

module.exports = {
    createMessengerBase: (base)=>{
        class Messenger {
            static get email(){
                return {
                    send: (options)=>{
                        switch(base.config.messenger.email){
                            case 'local':
                                return new Promise((resolve, reject)=>{
                                    try{

                                        let message = []
                                        message.push('\n======================================')
                                        message.push(`Sent At: ${moment().format('M/DD/YYYY hh:mm A')}`)
                                        message.push('Type: Email')
                                        message.push(`To: ${options.to}`)
                                        message.push(`Subject: ${options.subject}`)
                                        message.push(`Body:  ${options.body}`)
                                        message.push('-------------------------------------\n')
            
                                        fs.appendFileSync('./emails', message.join('\n'))
                                    }catch(error){
                                        reject(error)
                                    }
                                    
                                    resolve()
                                })
                            
                            case 'mailgun':
                                return new Promise((resolve, reject)=>{
                                    const client = mailgun({
                                        apiKey: base.config.mailgun.apiKey, 
                                        domain: base.config.mailgun.domain
                                    });
                                
                                    return client.messages().send({
                                        from: options.from, 
                                        to: options.to,
                                        subject: options.subject,
                                        html: options.body
                                    }, (err, body)=>{
                                            if (err) reject(err)
                                            else     resolve(body)
                                        }
                                    );
                                })
                        }
                    }
                }
            }
            static get sms(){
                return {
                    send: (options)=>{
                        
                        switch(options.config.messenger.sms){
                            case 'local':
                                console.log('=====================================')
                                console.log('Type: SMS')
                                console.log('To: ', options.mobilePhone)
                                console.log('Subject: ', options.subject)
                                console.log('Body: ', options.body)
                                console.log('-------------------------------------')
                                return true
                            case 'plivo':
                                let client = new _plivo.Client(
                                    base.config.plivo.authId,
                                    base.config.plivo.authToken
                                );
                                
                                return client.messages.create(
                                    options.from,
                                    options.to,
                                    options.body
                                )
                        }

                    }
                }
            }
            static get all() {
                return {
                    send: async (options)=>{
                        return [
                            await this.email.send(options),
                            await this.sms.send(options)
                        ]
                    }
                }
            }
        }

        return Messenger
    }
}