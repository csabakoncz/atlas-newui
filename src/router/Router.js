/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import $ from 'jquery';

import _ from 'underscore';
import Backbone from 'backbone';
import App from 'App';
import Globals from 'utils/Globals';
import Utils from 'utils/Utils';
import UrlLinks from 'utils/UrlLinks';
import Enums from 'utils/Enums';
import VGlossaryList from 'collection/VGlossaryList';
var AppRouter = Backbone.Router.extend({
    routes: {
        // Define some URL routes
        "": "defaultAction",
        "!/": "tagAttributePageLoad",
        // Search
        "!/search": "commonAction",
        "!/search/searchResult": "searchResult",
        // Tag
        "!/tag": "commonAction",
        "!/tag/tagAttribute/(*name)": "tagAttributePageLoad",
        // Glossary
        "!/glossary": "commonAction",
        "!/glossary/:id": "glossaryDetailPage",
        // Details
        "!/detailPage/:id": "detailPage",
        //Administrator page
        '!/administrator': 'administrator',
        '!/administrator/businessMetadata/:id': 'businessMetadataDetailPage',
        // Default
        '*actions': 'defaultAction'
    },
    initialize: function(options) {
        _.extend(this, _.pick(options, 'entityDefCollection', 'typeHeaders', 'enumDefCollection', 'classificationDefCollection', 'metricCollection', 'businessMetadataDefCollection'));
        this.showRegions();
        this.bindCommonEvents();
        this.listenTo(this, 'route', this.postRouteExecute, this);
        this.searchVent = new Backbone.Wreqr.EventAggregator();
        this.importVent = new Backbone.Wreqr.EventAggregator();
        this.glossaryCollection = new VGlossaryList([], {
            comparator: function(item) {
                return item.get("name");
            }
        });
        this.preFetchedCollectionLists = {
            'entityDefCollection': this.entityDefCollection,
            'typeHeaders': this.typeHeaders,
            'enumDefCollection': this.enumDefCollection,
            'classificationDefCollection': this.classificationDefCollection,
            'glossaryCollection': this.glossaryCollection,
            'metricCollection': this.metricCollection,
            'businessMetadataDefCollection': this.businessMetadataDefCollection
        }
        this.ventObj = {
            searchVent: this.searchVent,
            importVent: this.importVent
        }
        this.sharedObj = {
            searchTableColumns: {},
            glossary: {
                selectedItem: {}
            },
            searchTableFilters: {
                tagFilters: {},
                entityFilters: {}
            }
        }
    },
    bindCommonEvents: function() {
        var that = this;
        $('body').on('click', 'a.show-stat', function() {
            Promise.all([import('views/site/Statistics')]).then(function(
                [{
                    default: Statistics
                }]
            ) {
                new Statistics(_.extend({}, that.preFetchedCollectionLists, that.sharedObj, that.ventObj));
            });
        });
        $('body').on('click', 'li.aboutAtlas', function() {
            Promise.all([import('views/site/AboutAtlas')]).then(function(
                [{
                    default: AboutAtlas
                }]
            ) {
                new AboutAtlas();
            });
        });
    },
    showRegions: function() {},
    renderViewIfNotExists: function(options) {
        var view = options.view,
            render = options.render,
            manualRender = options.manualRender;
        if (!view.currentView) {
            if (render) view.show(options.render());
        } else {
            if (manualRender) options.manualRender();
        }
    },

    /**
     * @override
     * Execute a route handler with the provided parameters. This is an
     * excellent place to do pre-route setup or post-route cleanup.
     * @param  {Function} callback - route handler
     * @param  {Array}   args - route params
     */
    execute: function(callback, args) {
        this.preRouteExecute();
        if (callback) callback.apply(this, args);
        this.postRouteExecute();
    },
    preRouteExecute: function() {
        $(".tooltip").tooltip("hide");
        // console.log("Pre-Route Change Operations can be performed here !!");
    },
    postRouteExecute: function(name, args) {
        // console.log("Post-Route Change Operations can be performed here !!");
        // console.log("Route changed: ", name);
    },
    getHeaderOptions: function(Header, options) {
        var that = this;
        return {
            view: App.rNHeader,
            manualRender: function() {
                this.view.currentView.manualRender();
            },
            render: function() {
                return new Header(_.extend({}, that.preFetchedCollectionLists, that.sharedObj, that.ventObj, options));
            }
        }
    },
    detailPage: function(id) {
        var that = this;
        if (id) {
            Promise.all([
                import('views/site/Header'),
                import('views/detail_page/DetailPageLayoutView'),
                import('views/site/SideNavLayoutView'),
                import('collection/VEntityList')
            ]).then(function(
                [{
                    default: Header
                }, {
                    default: DetailPageLayoutView
                }, {
                    default: SideNavLayoutView
                }, {
                    default: VEntityList
                }]
            ) {
                const entityCollection = new VEntityList([], {});
                var paramObj = Utils.getUrlState.getQueryParams(),
                    options = _.extend({}, that.preFetchedCollectionLists, that.sharedObj, that.ventObj);
                that.renderViewIfNotExists(that.getHeaderOptions(Header));
                that.renderViewIfNotExists({
                    view: App.rSideNav,
                    manualRender: function() {
                        this.view.currentView.selectTab();
                    },
                    render: function() {
                        return new SideNavLayoutView(options);
                    }
                });
                App.rNContent.show(new DetailPageLayoutView(_.extend({ 'collection': entityCollection, 'id': id, 'value': paramObj }, options)));
                entityCollection.url = UrlLinks.entitiesApiUrl({ guid: id, minExtInfo: true });
                entityCollection.fetch({ reset: true });
            });
        }
    },
    tagAttributePageLoad: function(tagName) {
        var that = this;
        Promise.all([
            import('views/site/Header'),
            import('views/site/SideNavLayoutView'),
            import('views/tag/TagDetailLayoutView')
        ]).then(function(
            [{
                default: Header
            }, {
                default: SideNavLayoutView
            }, {
                default: TagDetailLayoutView
            }]
        ) {
            var paramObj = Utils.getUrlState.getQueryParams(),
                url = Utils.getUrlState.getQueryUrl().queyParams[0],
                options = _.extend({ 'tag': tagName, 'value': paramObj }, that.preFetchedCollectionLists, that.sharedObj, that.ventObj);
            that.renderViewIfNotExists(that.getHeaderOptions(Header));
            that.renderViewIfNotExists({
                view: App.rSideNav,
                manualRender: function() {
                    if (paramObj && paramObj.dlttag) {
                        Utils.setUrl({
                            url: url,
                            trigger: false,
                            updateTabState: true
                        });
                    }
                    this.view.currentView.RTagLayoutView.currentView.manualRender(_.extend({}, paramObj, { 'tagName': tagName }));
                    this.view.currentView.selectTab();
                },
                render: function() {
                    if (paramObj && paramObj.dlttag) {
                        Utils.setUrl({
                            url: url,
                            trigger: false,
                            updateTabState: true
                        });
                    }
                    return new SideNavLayoutView(options);
                }
            });
            if (tagName) {
                // updating paramObj to check for new queryparam.
                paramObj = Utils.getUrlState.getQueryParams();
                if (paramObj && paramObj.dlttag) {
                    return false;
                }
                App.rNContent.show(new TagDetailLayoutView(options));
            }
        });
    },
    glossaryDetailPage: function(id) {
        var that = this;
        if (id) {
            Promise.all([
                import('views/site/Header'),
                import('views/glossary/GlossaryDetailLayoutView'),
                import('views/site/SideNavLayoutView')
            ]).then(function(
                [{
                    default: Header
                }, {
                    default: GlossaryDetailLayoutView
                }, {
                    default: SideNavLayoutView
                }]
            ) {
                var paramObj = Utils.getUrlState.getQueryParams(),
                    options = _.extend({ 'guid': id, 'value': paramObj }, that.preFetchedCollectionLists, that.sharedObj, that.ventObj);
                that.renderViewIfNotExists(that.getHeaderOptions(Header));
                that.renderViewIfNotExists({
                    view: App.rSideNav,
                    manualRender: function() {
                        this.view.currentView.RGlossaryLayoutView.currentView.manualRender(options);
                        this.view.currentView.selectTab();
                    },
                    render: function() {
                        return new SideNavLayoutView(options)
                    }
                });
                App.rNContent.show(new GlossaryDetailLayoutView(options));
            });
        }
    },
    searchResult: function() {
        var that = this;
        Promise.all([
            import('views/site/Header'),
            import('views/site/SideNavLayoutView'),
            import('views/search/SearchDetailLayoutView')
        ]).then(function(
            [{
                default: Header
            }, {
                default: SideNavLayoutView
            }, {
                default: SearchDetailLayoutView
            }]
        ) {
            var paramObj = Utils.getUrlState.getQueryParams(),
                options = _.extend({}, that.preFetchedCollectionLists, that.sharedObj, that.ventObj);
            if (paramObj.tag) {
                var tagValidate = paramObj.tag,
                    isTagPresent = false;
                if ((tagValidate.indexOf('*') == -1)) {
                    classificationDefCollection.fullCollection.each(function(model) {
                        var name = Utils.getName(model.toJSON(), 'name');
                        if (model.get('category') == 'CLASSIFICATION') {
                            if (tagValidate) {
                                if (name === tagValidate) {
                                    isTagPresent = true;
                                }
                            }
                        }
                    });
                    _.each(Enums.addOnClassification, function(classificationName) {
                        if (classificationName === tagValidate) {
                            isTagPresent = true;
                        }
                    });
                    if (!isTagPresent) {
                        paramObj.tag = null;
                    }
                }
            }
            var isinitialView = true,
                isTypeTagNotExists = false,
                tempParam = _.extend({}, paramObj);
            that.renderViewIfNotExists(that.getHeaderOptions(Header));
            that.renderViewIfNotExists({
                view: App.rSideNav,
                manualRender: function() {
                    this.view.currentView.RSearchLayoutView.currentView.manualRender(paramObj);
                },
                render: function() {
                    return new SideNavLayoutView(_.extend({ 'value': paramObj }, options));
                }
            });
            App.rSideNav.currentView.selectTab();
            if (paramObj) {
                isinitialView = (paramObj.type || (paramObj.dslChecked == "true" ? "" : (paramObj.tag || paramObj.term)) || (paramObj.query ? paramObj.query.trim() : "")).length === 0;
            }
            App.rNContent.show(new SearchDetailLayoutView(
                _.extend({
                    'value': paramObj,
                    'initialView': isinitialView,
                    'isTypeTagNotExists': ((paramObj.type != tempParam.type) || (tempParam.tag != paramObj.tag))
                }, options)
            ));
        });
    },
    administrator: function() {
        var that = this;
        Promise.all([
            import("views/site/Header"),
            import("views/site/SideNavLayoutView"),
            import('views/administrator/AdministratorLayoutView')
        ]).then(function(
            [{
                default: Header
            }, {
                default: SideNavLayoutView
            }, {
                default: AdministratorLayoutView
            }]
        ) {
            var paramObj = Utils.getUrlState.getQueryParams(),
                options = _.extend({}, that.preFetchedCollectionLists, that.sharedObj, that.ventObj);
            that.renderViewIfNotExists(that.getHeaderOptions(Header));
            that.renderViewIfNotExists({
                view: App.rSideNav,
                manualRender: function() {
                    this.view.currentView.selectTab();
                    if (Utils.getUrlState.isTagTab()) {
                        this.view.currentView.RTagLayoutView.currentView.manualRender();
                    } else if (Utils.getUrlState.isGlossaryTab()) {
                        this.view.currentView.RGlossaryLayoutView.currentView.manualRender(_.extend({ "isTrigger": true, "value": paramObj }));
                    }
                },
                render: function() {
                    return new SideNavLayoutView(options);
                }
            });
            App.rNContent.show(new AdministratorLayoutView(_.extend({ value: paramObj, guid: null }, options)));
        });
    },
    businessMetadataDetailPage: function(guid) {
        var that = this;
        Promise.all([
            import("views/site/Header"),
            import("views/site/SideNavLayoutView"),
            import("views/business_metadata/BusinessMetadataContainerLayoutView")
        ]).then(function(
            [{
                default: Header
            }, {
                default: SideNavLayoutView
            }, {
                default: BusinessMetadataContainerLayoutView
            }]
        ) {
            var paramObj = Utils.getUrlState.getQueryParams(),
                options = _.extend({}, that.preFetchedCollectionLists, that.sharedObj, that.ventObj);
            that.renderViewIfNotExists(that.getHeaderOptions(Header));
            that.renderViewIfNotExists({
                view: App.rSideNav,
                manualRender: function() {
                    this.view.currentView.selectTab();
                    if (Utils.getUrlState.isTagTab()) {
                        this.view.currentView.RTagLayoutView.currentView.manualRender();
                    } else if (Utils.getUrlState.isGlossaryTab()) {
                        this.view.currentView.RGlossaryLayoutView.currentView.manualRender(_.extend({ "isTrigger": true, "value": paramObj }));
                    }
                },
                render: function() {
                    return new SideNavLayoutView(options);
                }
            });
            App.rNContent.show(new BusinessMetadataContainerLayoutView(_.extend({ guid: guid, value: paramObj }, options)));
        });
    },
    commonAction: function() {
        var that = this;
        Promise.all([
            import('views/site/Header'),
            import('views/site/SideNavLayoutView'),
            import('views/search/SearchDetailLayoutView')
        ]).then(function(
            [{
                default: Header
            }, {
                default: SideNavLayoutView
            }, {
                default: SearchDetailLayoutView
            }]
        ) {
            var paramObj = Utils.getUrlState.getQueryParams(),
                options = _.extend({}, that.preFetchedCollectionLists, that.sharedObj, that.ventObj);
            that.renderViewIfNotExists(that.getHeaderOptions(Header));
            that.renderViewIfNotExists({
                view: App.rSideNav,
                manualRender: function() {
                    this.view.currentView.selectTab();
                    if (Utils.getUrlState.isTagTab()) {
                        this.view.currentView.RTagLayoutView.currentView.manualRender();
                    } else if (Utils.getUrlState.isGlossaryTab()) {
                        this.view.currentView.RGlossaryLayoutView.currentView.manualRender(_.extend({ "isTrigger": true, "value": paramObj }));
                    }
                },
                render: function() {
                    return new SideNavLayoutView(options);
                }
            });

            if (Globals.entityCreate && Utils.getUrlState.isSearchTab()) {
                App.rNContent.show(new SearchDetailLayoutView(_.extend({ 'value': paramObj, 'initialView': true }, options)));
            } else {
                if (App.rNContent.currentView) {
                    App.rNContent.currentView.destroy();
                } else {
                    App.rNContent.$el.empty();
                }
            }
        });
    },
    defaultAction: function(actions) {
        // We have no matching route, lets just log what the URL was
        Utils.setUrl({
            url: '#!/search',
            mergeBrowserUrl: false,
            trigger: true,
            updateTabState: true
        });

        console.log('No route:', actions);
    }
});
export default AppRouter;