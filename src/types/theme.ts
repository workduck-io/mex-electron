/** A string of CSS color */
type Color = string

export interface ColorPalette {
  shades: {
    /** A string of CSS color */
    0: Color
    1: Color
    2: Color
    3: Color
    4: Color
    5: Color
    6: Color
    7: Color
    8: Color
    9: Color
  }
  primary: ColorText
  secondary: ColorText

  base: {
    white: Color
    black: Color
    red: Color
    orange: Color
    yellow: Color
    green: Color
    blue: Color
    gray: Color
  }

  states: {
    disabled: ColorText
    hover: ColorText
    focus: ColorText
    active: ColorText

    task: {
      todo: ColorText
      pending: ColorText
      completed: ColorText
    }

    item: {
      warning: ColorText
      error: ColorText
      success: ColorText
      info: ColorText
    }
  }
}

/** Color with variants for user interaction */
export interface AdvancedColor {
  /** Main color */
  main: Color

  /** Hover color === Focus color */
  hover: Color

  /** Active color */
  active: Color

  /** Disabled color */
  disabled: Color
}

export interface ColorText {
  /** Main color */
  main: Color

  /** Text color */
  text: Color
}

export interface ToastStyle {
  container: ElementPalette
  icon: ElementPalette
  header: ElementPalette
  body: ElementPalette
  close: ElementPalette
  button: ElementPalette
}

export interface ButtonBaseStyle {
  container: ElementPalette
  icon: ElementPalette
  text: ElementPalette
}

export interface ButtonStyle {
  primary: ButtonBaseStyle
  secondary: ButtonBaseStyle
  default: ButtonBaseStyle
  disabled: ButtonBaseStyle
}

export interface TextStyle {
  family: string
  weight: string
  size: string
  lineHeight: string
  letterSpacing: string
}

export interface MenuStyle {
  container: ElementPalette
  item: ElementPalette
}

/** Styles for a generic element */
export interface ElementPalette {
  /** Text Color */
  color: AdvancedColor

  /** Icon Color, If absent, text color is used */
  iconColor?: AdvancedColor

  /** Background Color | CSS Style */
  background: AdvancedColor | string

  /** Border Styles */
  border?: {
    /** Border style: single dashed etc. */
    style: string
    width: string
    color: AdvancedColor
    radius: string
  }

  /** Shadow Style */
  shadow?: string
}

export interface BadgeStyle {
  container: ElementPalette
  icon?: ElementPalette
}

export interface FormStyle {
  container: ElementPalette
  icon?: ElementPalette
  label?: ElementPalette
}

export interface UIPalette {
  themeType: 'light' | 'dark'

  /** The main background */
  background: string

  /** The text colors */
  text: {
    default: Color
    heading: Color
    subheading: Color

    /** Text with less importance */
    fade: Color

    /** Text for disabled content */
    disabled: Color

    /** Of a anchor link */
    link: {
      default: Color
      hover: Color
      /** Hover is used when not given */
      active?: Color
      /** Hover is used when not given */
      visited?: Color
    }
  }

  /** Styles of Card Elements */
  card: ElementPalette

  sidebar: {
    container: ElementPalette
    separator: AdvancedColor

    tree: {
      /** If absent, default styles are used */
      contextMenu?: MenuStyle

      link: {
        container: ElementPalette
        count: ElementPalette
        badge: BadgeStyle
      }
      /** Styles for tree item */
      node: {
        container: ElementPalette
        count: ElementPalette
        /** Styles for tree item toggle to show/hide children */
        toggle: ElementPalette
      }
      /** Styles for expand collapse toggle of entire sidebar */
      toggle: ElementPalette
    }
  }

  infobar: {
    container: ElementPalette
    separator: AdvancedColor
    outline: {
      container: ElementPalette
      item: ElementPalette
    }
    backlinks: {
      container: ElementPalette
      item: ElementPalette
    }
    tags: {
      /** For tags */
      tag: ElementPalette
      container: ElementPalette
      /** For the related notes */
      item: ElementPalette
    }
  }

  graph: {
    container: ElementPalette
    /** For Normal Nodes: Notes etc  */
    node: ElementPalette
    /** For the action node: Services/Flows etc  */
    action: ElementPalette
    edge: ElementPalette
  }

  collapsible: {
    header: {
      toggle: ElementPalette
      title: ElementPalette
    }
    content: ElementPalette
  }

  search: {
    /** For the search input container */
    container: ElementPalette
    input: ElementPalette
    button: ButtonStyle
    /** For the search result item: Card */
    card: ElementPalette
    /** For the search result item: Row */
    row: ElementPalette
    filter: {
      container: ElementPalette
      filterLabel: ElementPalette
      filter: {
        container: ElementPalette
        count: ElementPalette
      }
    }
    preview: {
      container: ElementPalette
      title: ElementPalette
      description: ElementPalette
      icon: ElementPalette
    }
  }

  titlebar: {
    search: {
      container: ElementPalette
      icon: ElementPalette
    }
    button: ButtonStyle
  }

  reminder: {
    container: ElementPalette
    icon: ElementPalette
    button: ButtonStyle
    snoozeControl: ElementPalette
  }

  toolbar: {
    button: ButtonStyle
  }

  /** Form Elements */
  form: {
    button: ButtonStyle
    /** Same used for text area */
    input: FormStyle
    select: FormStyle
    option: FormStyle
    multiInput: {
      container: ElementPalette
      input: ElementPalette
      item: ElementPalette
    }
    checkbox: FormStyle
    datePicker: {
      selectedDay: ElementPalette
      selectedMonth: ElementPalette
      selectedYear: ElementPalette
      dropdown: {
        container: ElementPalette
        item: ElementPalette
      }
      button: ButtonStyle
    }
  }

  tooltips: {
    element: ElementPalette
    shortcut: ElementPalette
  }

  toast: {
    success: ToastStyle
    error: ToastStyle
    info: ToastStyle
    warning: ToastStyle
  }

  contextMenu: MenuStyle

  metadata: {
    container: ElementPalette
    icon: ElementPalette
    profile: ElementPalette
    label: ElementPalette
    value: ElementPalette
  }

  editor: {
    headings: {
      h1: ElementPalette
      /** If others are absent, h1 styles are used */
      h2?: ElementPalette
      h3?: ElementPalette
      h4?: ElementPalette
      h5?: ElementPalette
      h6?: ElementPalette
    }
    paragraph: ElementPalette
    marks: {
      code: ElementPalette
      bold: ElementPalette
      italic: ElementPalette
      strikethrough: ElementPalette
    }
    /** Background color of highlighted block  */
    highlight: Color
    image: {
      container: ElementPalette
      caption: ElementPalette
    }
    dndHandle: ElementPalette
    task: {
      container: ElementPalette
      button: ButtonStyle
      state: {
        todo: ElementPalette
        pending: ElementPalette
        completed: ElementPalette
      }
    }
    /** If absent, default styles are used */
    contextMenu?: MenuStyle
    codeblock: ElementPalette
    blockquote: ElementPalette
    list: {
      item: ElementPalette
      // Color of the Bullet/Number
      bullet?: AdvancedColor
    }
    table: {
      container: ElementPalette
      header: ElementPalette
      row: ElementPalette
      cell: ElementPalette
    }
    /** For embedding Web content, excalidraw canvas, inside the editor */
    embed: {
      container: ElementPalette
      icon: ElementPalette
      button: ButtonStyle
      input: ElementPalette
    }
  }

  /** Displayed shortcuts */
  shortcut: ElementPalette

  /** Tooltips */
  tooltip: {
    container: ElementPalette
    /** If absent, global shortcut styles are used */
    shortcut?: ElementPalette
  }

  badges: {
    neutral: BadgeStyle
    success: BadgeStyle
    warning: BadgeStyle
    critical: BadgeStyle
    info: BadgeStyle
    task: {
      todo: BadgeStyle
      pending: BadgeStyle
      completed: BadgeStyle
    }
  }

  /** Modals */
  modal: {
    container: ElementPalette
    header: ElementPalette
    content: ElementPalette
    closeModal: ElementPalette
    footer: {
      container: ElementPalette
      button: ElementPalette
    }
  }

  floatHelp: {
    container: ElementPalette
    button: ElementPalette
    item: ElementPalette
    /** Styles for Markdown autoformat hints */
    markdownHints: ElementPalette
  }

  /**  Tag Element */
  tag: ElementPalette

  /** For preview containers */
  preview: {
    container: ElementPalette
    title: ElementPalette
    tag: ElementPalette
    close: ElementPalette
  }

  /** Colors for palette */
  palette: {
    primary: AdvancedColor
    accent: AdvancedColor
  }
}
