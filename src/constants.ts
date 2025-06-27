import React from 'react';
import * as Icons from './assets/icons';

export interface Page {
  id: string;
  name: string;
  isActive: boolean;
  icon?: React.ReactNode;
}

// Page Names
export const PAGE_NAMES = {
  INFO: "Info",
  DETAILS: "Details",
  OTHER: "Other",
  ENDING: "Ending",
};

export const INITIAL_PAGES: Page[] = [
  {
    id: "1",
    name: PAGE_NAMES.INFO,
    isActive: true,
    icon: React.createElement(Icons.InfoIcon),
  },
  {
    id: "2",
    name: PAGE_NAMES.DETAILS,
    isActive: false,
    icon: React.createElement(Icons.DetailsIcon),
  },
  {
    id: "3",
    name: PAGE_NAMES.OTHER,
    isActive: false,
    icon: React.createElement(Icons.DocumentIcon),
  },
  {
    id: "4",
    name: PAGE_NAMES.ENDING,
    isActive: false,
    icon: React.createElement(Icons.CheckIcon),
  },
];

export const CONTEXT_MENU_CONFIG = {
  width: 200,
  height: 220,
  offset: 8,
  minScreenMargin: 10,
};

export const DRAG_ACTIVATION_DISTANCE = 3;

// UI Text Constants
export const UI_TEXT = {
  contextMenu: {
    header: "Settings",
    rename: "Rename",
    copy: "Copy",
    duplicate: "Duplicate",
    delete: "Delete",
  },
  form: {
    emailQuestion: "What's your email address?",
    emailPlaceholder: "Enter your email address",
    emailSubtitle: "We'll send you birthday updates here!",
  },
  buttons: {
    addPage: "Add Page",
  },
};

// Animation Durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  PAGE_SLIDE_IN: 500,
  PAGE_SLIDE_OUT: 300,
  CONTEXT_MENU_TRANSITION: 150,
  SCROLL_TO_NEW_PAGE_DELAY: 100,
} as const;

// Accessibility
export const ACCESSIBILITY = {
  KEYBOARD_TRIGGER_KEYS: ['Enter', ' '],
  ESCAPE_KEY: 'Escape',
} as const;

// Style Constants
export const DRAG_STYLES = {
  opacity: 0.7,
  zIndex: 1000,
} as const;
