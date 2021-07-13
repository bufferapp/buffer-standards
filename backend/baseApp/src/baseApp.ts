import * as BuffLog from '@bufferapp/bufflog'
import { ApolloServer } from 'apollo-server'
import { APP_STAGE, DB_STAGE} from '../env'

interface IGraphQlApiOptions {
    typeDefs: Array<unknown>
    resolvers: Array<unknown>
    context: Object
    mocks: Object

}

class BaseApp {

    private _state: string
    private _api: ApolloServer

    protected async init(): Promise<void> {
        this._state = 'new'
        this._setupGracefulShutdownHandler()
    }

    get state(): string {
        return this._state
    }

    get api(): ApolloServer {
        return this._api
    }

    public markAsReady(): void {
        this._state = 'ready'
    }

    public markAsShuttingDown(): void {
        this._state = 'shutdown'
    }

    private _setupGracefulShutdownHandler(): void {
        // On sigterm event
        process.on('SIGTERM', this.onSigterm.bind(this))
    }

    private onSigterm(): void {
        const READINESS_PROBE_DELAY = 2 * 2 * 1000 // failureThreshold: 2, periodSeconds: 2 (4s)
        const DEBUG_DELAY = 1 * 1000 // 1s

        this.markAsShuttingDown()
        BuffLog.notice('SIGTERM: Setting state to "shutdown"')

        const delayMillis = READINESS_PROBE_DELAY + DEBUG_DELAY
        const delaySeconds = delayMillis / 1000
        BuffLog.notice(`SIGTERM: Disconnecting in ${delaySeconds} seconds`)

        // Wait a little bit to give enough time for Kubernetes readiness probe to fail (we don't want more traffic)
        // Don't worry livenessProbe won"t kill it until (failureThreshold: 3) => 30s
        // http://www.bite-code.com/2015/07/27/implementing-graceful-shutdown-for-docker-containers-in-go-part-2/
        setTimeout(this._greacefulStop, delayMillis)
    }

    private _greacefulStop(): void {
        // Will be used to Gracefully stop some external ressources (DB, cron jobs, sqs queues ...)
    }

    public async initGraphQlApi(options: IGraphQlApiOptions): Promise<void> {
        const { typeDefs, resolvers, context, mocks } = options

        const config: any = {
            engine: {
                reportSchema: true,
            },
            typeDefs,
            resolvers,
            context,
            mocks: DB_STAGE === 'mock' ? mocks : null,
            onHealthCheck: async () => {
                return
            },
            tracing: !(APP_STAGE === 'production'),
        }

        this._api = new ApolloServer(config)
    }
}

export { BaseApp }