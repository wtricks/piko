import type { ComponentGroup, LibraryType } from '@/stores/component'

export const BUILTIN_COMPONENTS: ComponentGroup[] = [
  {
    groupId: 'builtin-commonly-used',
    groupName: 'Commonly Used Components',
    items: [
      {
        id: 'view',
        name: 'View',
        icon: 'mdi:view-grid-outline',
        description:
          'A container that supports layout with flexbox, style, touch handling, and accessibility controls.',
      },
      {
        id: 'text',
        name: 'Text',
        icon: 'mdi:format-text',
        description: 'Displays text with style, nesting, and accessibility support.',
      },
      {
        id: 'image',
        name: 'Image',
        icon: 'mdi:image-outline',
        description: 'Displays images from various sources with scaling and styling options.',
      },
    ],
  },
  {
    groupId: 'builtin-layout-elements',
    groupName: 'Layout Elements',
    items: [
      {
        id: 'scrollview',
        name: 'ScrollView',
        icon: 'mdi:gesture-swipe-vertical',
        description: 'Provides a scrolling container for content that exceeds viewport size.',
      },
      {
        id: 'flatlist',
        name: 'FlatList',
        icon: 'mdi:format-list-bulleted',
        description: 'Efficient scrolling list of changing data, optimized for large datasets.',
      },
      {
        id: 'safearea',
        name: 'SafeAreaView',
        icon: 'mdi:cellphone-link',
        description: 'Renders content within the safe area boundaries of a device.',
      },
    ],
  },
  {
    groupId: 'builtin-base-elements',
    groupName: 'Base Elements',
    items: [
      {
        id: 'pressable',
        name: 'Pressable',
        icon: 'lucide:hand',
        description: 'Detects various forms of press interactions on any element.',
      },
      {
        id: 'touchableopacity',
        name: 'TouchableOpacity',
        icon: 'mdi:gesture-tap-button',
        description:
          'A wrapper for making views respond properly to touches with opacity animation.',
      },
    ],
  },
  {
    groupId: 'builtin-page-elements',
    groupName: 'Page Elements',
    items: [
      {
        id: 'statusbar',
        name: 'StatusBar',
        icon: 'mdi:cellphone-information',
        description: 'Controls the app status bar appearance and behavior.',
      },
      {
        id: 'modal',
        name: 'Modal',
        icon: 'mdi:window-maximize',
        description: 'Displays content above an enclosing view with a dimmed background.',
      },
    ],
  },
  {
    groupId: 'builtin-form-elements',
    groupName: 'Form Elements',
    items: [
      {
        id: 'textinput',
        name: 'TextInput',
        icon: 'mdi:text-box-outline',
        description: 'Allows user text input with configurable keyboard and styles.',
      },
      {
        id: 'switch',
        name: 'Switch',
        icon: 'mdi:toggle-switch',
        description: 'Renders a boolean toggle switch.',
      },
    ],
  },
]

export const PROJECT_COMPONENTS: ComponentGroup[] = [
  {
    groupId: 'project-dashboard',
    groupName: 'Dashboard Components',
    items: [
      {
        id: 'project-card',
        name: 'StatsCard',
        image: 'https://placehold.co/200x200?text=StatsCard',
        description: 'Displays key metrics with icons and labels.',
      },
      {
        id: 'project-chart',
        name: 'BarChart',
        image: 'https://placehold.co/200x200?text=BarChart',
        description: 'Custom chart component displaying analytic data.',
      },
    ],
  },
  {
    groupId: 'project-profile',
    groupName: 'Profile Components',
    items: [
      {
        id: 'project-avatar',
        name: 'UserAvatar',
        image: 'https://placehold.co/200x200?text=UserAvatar',
        description: 'Reusable profile avatar component with border and initials.',
      },
    ],
  },
]

export const LIBRARY_COMPONENTS: LibraryType[] = [
  {
    id: 'lib-react-native-paper',
    name: 'React Native Paper',
    icon: 'mdi:library',
    items: [
      {
        groupId: 'paper-buttons',
        groupName: 'Buttons',
        items: [
          {
            id: 'lib-paper-button',
            name: 'PaperButton',
            image: 'https://placehold.co/200x200?text=PaperButton',
            icon: 'mdi:button-cursor',
            description: 'Material Design button with ripple effect.',
          },
        ],
      },
      {
        groupId: 'paper-inputs',
        groupName: 'Inputs',
        items: [
          {
            id: 'lib-paper-textinput',
            name: 'PaperTextInput',
            image: 'https://placehold.co/200x200?text=PaperTextInput',
            icon: 'mdi:form-textbox',
            description: 'Text input field styled according to Material guidelines.',
          },
        ],
      },
    ],
  },
  {
    id: 'lib-ui-kitten',
    name: 'UI Kitten',
    icon: 'mdi:cat',
    items: [
      {
        groupId: 'kitten-layouts',
        groupName: 'Layouts',
        items: [
          {
            id: 'lib-kitten-card',
            name: 'KittenCard',
            image: 'https://placehold.co/200x200?text=KittenCard',
            icon: 'mdi:view-agenda-outline',
            description: 'Stylish card layout from UI Kitten library.',
          },
        ],
      },
    ],
  },
]
