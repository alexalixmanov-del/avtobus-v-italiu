import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { Component } from './booking.js';

const props = JSON.parse(document.getElementById('app-props').textContent);
hydrateRoot(document.getElementById('app'), React.createElement(Component, props));
