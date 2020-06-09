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

import Backbone from 'backbone';

import AdministratorLayoutView_tmpl from 'hbs!tmpl/administrator/AdministratorLayoutView_tmpl';
import VEntityList from 'collection/VEntityList';
import VSearch from 'models/VSearch';
import Utils from 'utils/Utils';
import Enums from 'utils/Enums';
import UrlLinks from 'utils/UrlLinks';
import CommonViewFunction from 'utils/CommonViewFunction';
'use strict';

var AdministratorLayoutView = Backbone.Marionette.LayoutView.extend(
    /** @lends AuditTableLayoutView */
    {
        _viewName: 'AdministratorLayoutView',

        template: AdministratorLayoutView_tmpl,

        /** Layout sub regions */
        regions: {
            RBusinessMetadataTableLayoutView: "#r_businessMetadataTableLayoutView",
            REnumTableLayoutView: '#r_enumTableLayoutView',
            RAdminTableLayoutView: '#r_adminTableLayoutView'
        },

        /** ui selector cache */
        ui: {
            tablist: '[data-id="tab-list"] li'
        },
        /** ui events hash */
        events: function() {
            var events = {};
            events["click " + this.ui.tablist] = function(e) {
                var tabValue = $(e.currentTarget).attr('role');
                Utils.setUrl({
                    url: Utils.getUrlState.getQueryUrl().queyParams[0],
                    urlParams: { tabActive: tabValue || 'properties' },
                    mergeBrowserUrl: false,
                    trigger: false,
                    updateTabState: true
                });

            };

            return events;
        },
        /**
         * intialize a new AuditTableLayoutView Layout
         * @constructs
         */
        initialize: function(options) {
            _.extend(this, _.pick(options, 'value', 'entityDefCollection', 'businessMetadataDefCollection', 'enumDefCollection', 'searchTableFilters'));

        },
        onShow: function() {
            if (this.value && this.value.tabActive) {
                this.$('.nav.nav-tabs').find('[role="' + this.value.tabActive + '"]').addClass('active').siblings().removeClass('active');
                this.$('.tab-content').find('[role="' + this.value.tabActive + '"]').addClass('active').siblings().removeClass('active');
                $("html, body").animate({ scrollTop: (this.$('.tab-content').offset().top + 1200) }, 1000);
            }
        },
        bindEvents: function() {
            this.renderEnumLayoutView();
            this.renderAdminLayoutView();
        },
        onRender: function() {
            this.renderBusinessMetadataLayoutView();
            this.bindEvents();
        },
        renderBusinessMetadataLayoutView: function(obj) {
            var that = this;
            Promise.all([import('views/business_metadata/BusinessMetadataTableLayoutView')]).then(function(
                [{
                    default: BusinessMetadataTableLayoutView
                }]
            ) {
                that.RBusinessMetadataTableLayoutView.show(new BusinessMetadataTableLayoutView({ businessMetadataDefCollection: that.businessMetadataDefCollection, entityDefCollection: that.entityDefCollection }));
            });
        },
        renderEnumLayoutView: function(obj) {
            var that = this;
            Promise.all([import("views/business_metadata/EnumCreateUpdateItemView")]).then(function(
                [{
                    default: EnumCreateUpdateItemView
                }]
            ) {
                var view = new EnumCreateUpdateItemView({
                    enumDefCollection: that.enumDefCollection,
                    businessMetadataDefCollection: that.businessMetadataDefCollection
                });
                that.REnumTableLayoutView.show(view);
            });
        },
        renderAdminLayoutView: function(obj) {
            var that = this;
            Promise.all([import("views/audit/AdminAuditTableLayoutView")]).then(function(
                [{
                    default: AdminAuditTableLayoutView
                }]
            ) {
                var view = new AdminAuditTableLayoutView({
                    searchTableFilters: that.searchTableFilters,
                    entityDefCollection: that.entityDefCollection,
                    enumDefCollection: that.enumDefCollection
                });
                that.RAdminTableLayoutView.show(view);
            });
        }
    });
export default AdministratorLayoutView;