import type { TreeNode } from '@/composables/useTree'

export const PROJECT_SCREENS: TreeNode[] = [
  {
    id: 'root',
    type: 'folder',
    name: 'App',
    icon: 'material-symbols:apps',
    defaultState: 'open',
    droppable: true,
    children: [
      {
        id: 'home-screen',
        type: 'folder',
        name: 'Home Screen',
        icon: 'mdi:home-outline',
        defaultState: 'open',
        droppable: true,
        children: [
          {
            id: 'header',
            type: 'folder',
            name: 'Header',
            icon: 'mdi:view-headline',
            defaultState: 'open',
            children: [
              {
                id: 'title',
                type: 'file',
                name: 'Title Text',
                icon: 'mdi:format-title',
                selectable: true,
              },
              {
                id: 'subtitle',
                type: 'file',
                name: 'Subtitle',
                icon: 'mdi:subtitles-outline',
                selectable: true,
              },
            ],
          },
          {
            id: 'body',
            type: 'folder',
            name: 'Body',
            icon: 'mdi:view-list-outline',
            defaultState: 'open',
            children: [
              {
                id: 'image-banner',
                type: 'file',
                name: 'Image Banner',
                icon: 'mdi:image-outline',
                selectable: true,
              },
              {
                id: 'button',
                type: 'file',
                name: 'Primary Button',
                icon: 'mdi:gesture-tap-button',
                selectable: true,
              },
              {
                id: 'card-list',
                type: 'folder',
                name: 'Card List',
                icon: 'mdi:cards-outline',
                defaultState: 'close',
                children: [
                  {
                    id: 'card-1',
                    type: 'file',
                    name: 'Card Item 1',
                    icon: 'mdi:card-outline',
                    selectable: true,
                  },
                  {
                    id: 'card-2',
                    type: 'file',
                    name: 'Card Item 2',
                    icon: 'mdi:card-outline',
                    selectable: true,
                  },
                ],
              },
            ],
          },
          {
            id: 'footer',
            type: 'folder',
            name: 'Footer',
            icon: 'mdi:page-layout-footer',
            children: [
              {
                id: 'copyright',
                type: 'file',
                name: 'Copyright Text',
                icon: 'mdi:copyright',
              },
            ],
          },
        ],
      },
      {
        id: 'profile-screen',
        type: 'folder',
        name: 'Profile Screen',
        icon: 'mdi:account-outline',
        defaultState: 'close',
        children: [
          {
            id: 'profile-header',
            type: 'file',
            name: 'Profile Header',
            icon: 'mdi:account-box-outline',
          },
          {
            id: 'settings-button',
            type: 'file',
            name: 'Settings Button',
            icon: 'mdi:cog-outline',
          },
        ],
      },
      {
        id: 'settings-screen',
        type: 'folder',
        name: 'Settings Screen',
        icon: 'mdi:cog-outline',
        defaultState: 'close',
        children: [
          {
            id: 'darkmode-toggle',
            type: 'file',
            name: 'Dark Mode Switch',
            icon: 'mdi:theme-light-dark',
          },
          {
            id: 'language-picker',
            type: 'file',
            name: 'Language Picker',
            icon: 'mdi:translate',
          },
        ],
      },
    ],
  },
]

export const HOME_SCREEN_COMPONENTS: TreeNode = {
  id: 'home-screen',
  type: 'folder',
  name: 'Home Screen',
  icon: 'mdi:home-outline',
  defaultState: 'open',
  droppable: true,
  children: [
    {
      id: 'safe-area',
      type: 'folder',
      name: 'SafeAreaView',
      icon: 'mdi:cellphone-arrow-down',
      droppable: true,
      children: [
        {
          id: 'container',
          type: 'folder',
          name: 'Container (View)',
          icon: 'mdi:view-dashboard-outline',
          droppable: true,
          children: [
            {
              id: 'header',
              type: 'folder',
              name: 'Header',
              icon: 'mdi:view-headline',
              children: [
                {
                  id: 'title-text',
                  type: 'folder',
                  name: 'Text: Welcome Back!',
                  icon: 'mdi:format-title',
                },
                {
                  id: 'subtitle-text',
                  type: 'folder',
                  name: 'Text: Explore your dashboard',
                  icon: 'mdi:subtitles-outline',
                },
              ],
            },
            {
              id: 'search-bar',
              type: 'folder',
              name: 'SearchBar',
              icon: 'mdi:magnify',
              children: [
                {
                  id: 'input-field',
                  type: 'folder',
                  name: 'TextInput',
                  icon: 'mdi:text-box-outline',
                },
                {
                  id: 'search-icon',
                  type: 'folder',
                  name: 'Icon: Search',
                  icon: 'mdi:magnify',
                },
              ],
            },
            {
              id: 'content-section',
              type: 'folder',
              name: 'Content Section',
              icon: 'mdi:view-list-outline',
              children: [
                {
                  id: 'card1',
                  type: 'folder',
                  name: 'Card: Featured Item',
                  icon: 'mdi:card-outline',
                  children: [
                    {
                      id: 'card1-image',
                      type: 'folder',
                      name: 'Image',
                      icon: 'mdi:image-outline',
                    },
                    {
                      id: 'card1-title',
                      type: 'folder',
                      name: 'Text: Item Title',
                      icon: 'mdi:format-title',
                    },
                    {
                      id: 'card1-button',
                      type: 'folder',
                      name: 'Button: View Details',
                      icon: 'mdi:gesture-tap-button',
                    },
                  ],
                },
                {
                  id: 'card2',
                  type: 'folder',
                  name: 'Card: Latest Update',
                  icon: 'mdi:card-outline',
                  children: [
                    {
                      id: 'card2-image',
                      type: 'folder',
                      name: 'Image',
                      icon: 'mdi:image-outline',
                    },
                    {
                      id: 'card2-title',
                      type: 'folder',
                      name: 'Text: Update Info',
                      icon: 'mdi:format-title',
                    },
                  ],
                },
              ],
            },
            {
              id: 'bottom-nav',
              type: 'folder',
              name: 'Bottom Navigation',
              icon: 'mdi:menu',
              children: [
                {
                  id: 'nav-home',
                  type: 'folder',
                  name: 'Nav Item: Home',
                  icon: 'mdi:home-outline',
                },
                {
                  id: 'nav-profile',
                  type: 'folder',
                  name: 'Nav Item: Profile',
                  icon: 'mdi:account-outline',
                },
                {
                  id: 'nav-settings',
                  type: 'folder',
                  name: 'Nav Item: Settings',
                  icon: 'mdi:cog-outline',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
