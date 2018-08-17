/**
 * Compose main application reducer.
 */

import { combineReducers } from 'redux';

// add page reducers here
import main from 'pages/home/homeReducer';
import objects from 'pages/objects/objectsReducers';
import sidebar from 'components/sidebar/sidebarReducer';
import { reducer as entity } from 'pages/entity';
import configurator from 'pages/configurator/reducer';
import dataCollector from 'pages/data-collector/reducer'

export default combineReducers({ main, objects, sidebar, entity, configurator, dataCollector });
