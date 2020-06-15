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

import App from 'App';

import Router from 'router/Router';
import Helper from 'utils/Helper';
import CommonViewFunction from 'utils/CommonViewFunction';
import Globals from 'utils/Globals';
import UrlLinks from 'utils/UrlLinks';
import VEntityList from 'collection/VEntityList';
import VTagList from 'collection/VTagList';
import Enums from 'utils/Enums';
import 'utils/Overrides';
import 'bootstrap';
import 'd3';
import 'select2';
var that = {};
that.asyncFetchCounter = 7 + (Enums.addOnEntities.length + 1);
// entity
that.entityDefCollection = new VEntityList();
that.entityDefCollection.url = UrlLinks.entitiesDefApiUrl();
// typeHeaders
that.typeHeaders = new VTagList();
that.typeHeaders.url = UrlLinks.typesApiUrl();
// enum
that.enumDefCollection = new VTagList();
// used by TagLayoutView:
window.enumDefCollection = that.enumDefCollection

that.enumDefCollection.url = UrlLinks.enumDefApiUrl();
that.enumDefCollection.modelAttrName = "enumDefs";
// classfication
that.classificationDefCollection = new VTagList();
// metric
that.metricCollection = new VTagList();
that.metricCollection.url = UrlLinks.metricsApiUrl();
that.metricCollection.modelAttrName = "data";
// businessMetadata
that.businessMetadataDefCollection = new VEntityList();
that.businessMetadataDefCollection.url = UrlLinks.businessMetadataDefApiUrl();
that.businessMetadataDefCollection.modelAttrName = "businessMetadataDefs";

App.appRouter = new Router({
    entityDefCollection: that.entityDefCollection,
    typeHeaders: that.typeHeaders,
    enumDefCollection: that.enumDefCollection,
    classificationDefCollection: that.classificationDefCollection,
    metricCollection: that.metricCollection,
    businessMetadataDefCollection: that.businessMetadataDefCollection
});

var startApp = function() {
    if (that.asyncFetchCounter === 0) {
        App.start();
    }
};
CommonViewFunction.userDataFetch({
    url: UrlLinks.sessionApiUrl(),
    callback: function(response) {
        if (response) {
            if (response.userName) {
                Globals.userLogedIn.status = true;
                Globals.userLogedIn.response = response;
            }
            if (response['atlas.entity.create.allowed'] !== undefined) {
                Globals.entityCreate = response['atlas.entity.create.allowed'];
            }
            if (response['atlas.entity.update.allowed'] !== undefined) {
                Globals.entityUpdate = response['atlas.entity.update.allowed'];
            }
            if (response['atlas.ui.editable.entity.types'] !== undefined) {
                var entityTypeList = response['atlas.ui.editable.entity.types'].trim().split(",");
                if (entityTypeList.length) {
                    if (entityTypeList[0] === "*") {
                        Globals.entityTypeConfList = [];
                    } else if (entityTypeList.length > 0) {
                        Globals.entityTypeConfList = entityTypeList;
                    }
                }
            }
            if (response['atlas.ui.default.version'] !== undefined) {
                Globals.DEFAULT_UI = response['atlas.ui.default.version'];
            }
        }
        --that.asyncFetchCounter;
        startApp();
    }
});
that.entityDefCollection.fetch({
    complete: function() {
        that.entityDefCollection.fullCollection.comparator = function(model) {
            return model.get('name').toLowerCase();
        };
        that.entityDefCollection.fullCollection.sort({ silent: true });
        --that.asyncFetchCounter;
        startApp();
    }
});
that.typeHeaders.fetch({
    complete: function() {
        that.typeHeaders.fullCollection.comparator = function(model) {
            return model.get('name').toLowerCase();
        }
        that.typeHeaders.fullCollection.sort({ silent: true });
        --that.asyncFetchCounter;
        startApp();
    }
});
that.enumDefCollection.fetch({
    complete: function() {
        that.enumDefCollection.fullCollection.comparator = function(model) {
            return model.get('name').toLowerCase();
        };
        that.enumDefCollection.fullCollection.sort({ silent: true });
        --that.asyncFetchCounter;
        startApp();
    }
});
that.classificationDefCollection.fetch({
    complete: function() {
        that.classificationDefCollection.fullCollection.comparator = function(model) {
            return model.get('name').toLowerCase();
        };
        that.classificationDefCollection.fullCollection.sort({ silent: true });
        --that.asyncFetchCounter;
        startApp();
    }
});

that.metricCollection.fetch({
    complete: function() {
        --that.asyncFetchCounter;
        startApp();
    }
});

that.businessMetadataDefCollection.fetch({
    complete: function() {
        that.businessMetadataDefCollection.fullCollection.comparator = function(model) {
            return model.get('name').toLowerCase();
        };
        that.businessMetadataDefCollection.fullCollection.sort({ silent: true });
        --that.asyncFetchCounter;
        startApp();
    }
});

CommonViewFunction.fetchRootEntityAttributes({
    url: UrlLinks.rootEntityDefUrl(Enums.addOnEntities[0]),
    entity: Enums.addOnEntities,
    callback: function() {
        --that.asyncFetchCounter;
        startApp();
    }
});

CommonViewFunction.fetchRootClassificationAttributes({
    url: UrlLinks.rootClassificationDefUrl(Enums.addOnClassification[0]),
    classification: Enums.addOnClassification,
    callback: function() {
        --that.asyncFetchCounter;
        startApp();
    }
});