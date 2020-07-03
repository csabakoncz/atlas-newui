import AboutAtlas from '../AboutAtlas'
import Backbone from 'backbone'
import sinon from 'sinon'

beforeEach(()=>{
    var syncStub = sinon.stub()
    syncStub.yieldsTo('success', {Version: 'TEST_VERSION'})
    sinon.replace(Backbone,'sync',syncStub)
})
afterEach(()=>{
    sinon.restore()
})

it('can display the version', ()=>{
    let view = new AboutAtlas()
    view.render()
    const versionDiv = view.$el.find("[data-id='atlasVersion']")
    expect(versionDiv.text()).toBe("Version : TEST_VERSION")
})