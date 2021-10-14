import { action, observable } from 'mobx'
import { nanoid } from 'nanoid'
import { automation, automationStatus } from './automation'

export type RunMode = 'single'

const defaults = {
  url: '',
  component: {
    height: 500,
    width: 500,
  },
  e2e: {
    height: 660,
    width: 1000,
  },
} as const

type Callback = (...args: unknown[]) => void

export class BaseStore {
  @observable spec: Cypress.Spec | undefined
  @observable specs: Cypress.Spec[] = []
  @observable specRunId: string | undefined
  @observable runMode: RunMode = 'single'
  @observable automation: typeof automationStatus[number] = automation.CONNECTING
  @observable isLoading = true
  @observable width: number
  @observable height: number
  @observable url = ''
  @observable highlightUrl = false
  @observable isLoadingUrl = false

  @observable messageTitle?: string
  @observable messageDescription?: 'info' | 'warning'
  @observable messageType?: string
  @observable callbackAfterUpdate?: Callback

  constructor (testingType: Cypress.TestingType) {
    this.width = defaults[testingType].width
    this.height = defaults[testingType].height
  }

  @action setSingleSpec (spec: Cypress.Spec | undefined) {
    this.setSpec(spec)
  }

  @action setSpec (spec: Cypress.Cypress['spec'] | undefined) {
    this.spec = spec
    this.specRunId = nanoid()
  }

  @action setSpecs (specs: Cypress.Spec[]) {
    this.specs = specs
  }

  @action updateSpecByUrl (specUrl: string) {
    const foundSpec = this.specs.find((x) => x.name === decodeURI(specUrl))

    if (foundSpec) {
      this.spec = foundSpec
    }
  }

  @action setIsLoading (isLoading) {
    this.isLoading = isLoading
  }

  @action updateDimensions (width: number, height: number) {
    this.height = height
    this.width = width
  }

  @action resetUrl () {
    this.url = ''
    this.highlightUrl = false
    this.isLoadingUrl = false
  }

  @action clearMessage () {
    this.messageTitle = undefined
    this.messageDescription = undefined
    this.messageType = undefined
  }

  @action setCallbackAfterUpdateToNull () {
    this.callbackAfterUpdate = undefined
  }

  setCallbackAfterUpdate (cb: Callback) {
    this.callbackAfterUpdate = () => {
      this.setCallbackAfterUpdateToNull()

      cb()
    }
  }
}
