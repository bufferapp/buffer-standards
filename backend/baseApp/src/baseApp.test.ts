import { BaseApp } from './baseApp'

async function wait(ms): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

describe('Base App tests', () => {
    const app = new BaseApp()
   
    it('it should init the base app', async () => {
        await app.init()
        expect(app.state).toEqual('new')
    })

    it('it should exit gracefully in case process is killed', async () => {
        app.onSigterm()
        await wait(5000)

        expect(app.state).toEqual('shutdown')
    })
})
