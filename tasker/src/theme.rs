use iced::{application, color, widget::{button, container, text, text_input, checkbox}, Theme, Color, Border};

#[derive(Debug, Clone, Copy, Default)]
pub struct CustomTheme;

impl application::StyleSheet for CustomTheme {
    type Style = ();

    fn appearance(&self, _style: &Self::Style) -> application::Appearance {
        application::Appearance {
            background_color: Color::WHITE,
            text_color: Color::BLACK,
        }
    }
}

impl container::StyleSheet for CustomTheme {
    type Style = ();

    fn appearance(&self, _style: &Self::Style) -> container::Appearance {
        container::Appearance {
            background: Some(Color::WHITE.into()),
            ..Default::default()
        }
    }
}

impl button::StyleSheet for CustomTheme {
    type Style = ();

    fn active(&self, _style: &Self::Style) -> button::Appearance {
        button::Appearance {
            background: Some(color!(0x008080).into()),
            text_color: Color::WHITE,
            ..Default::default()
        }
    }

    fn hovered(&self, style: &Self::Style) -> button::Appearance {
        button::Appearance {
            background: Some(color!(0x009999).into()),
            ..self.active(style)
        }
    }
}

impl text::StyleSheet for CustomTheme {
    type Style = ();

    fn appearance(&self, _style: Self::Style) -> text::Appearance {
        text::Appearance { color: None }
    }
}

impl text_input::StyleSheet for CustomTheme {
    type Style = ();

    fn active(&self, _style: &Self::Style) -> text_input::Appearance {
        text_input::Appearance {
            background: Color::WHITE.into(),
            border: Border {
                color: color!(0x008080),
                width: 1.0,
                radius: 2.0.into(),
            },
            icon_color: Color::BLACK,
        }
    }

    fn focused(&self, style: &Self::Style) -> text_input::Appearance {
        self.active(style)
    }

    fn placeholder_color(&self, _style: &Self::Style) -> Color {
        color!(0x808080)
    }

    fn value_color(&self, _style: &Self::Style) -> Color {
        Color::BLACK
    }

    fn selection_color(&self, _style: &Self::Style) -> Color {
        color!(0x008080)
    }

    fn disabled(&self, style: &Self::Style) -> text_input::Appearance {
        self.active(style)
    }

    fn disabled_color(&self, _style: &Self::Style) -> Color {
        color!(0x808080)
    }
}

impl checkbox::StyleSheet for CustomTheme {
    type Style = ();

    fn active(&self, _style: &Self::Style, _is_checked: bool) -> checkbox::Appearance {
        checkbox::Appearance {
            background: Color::WHITE.into(),
            border: Border {
                color: color!(0x008080),
                width: 1.0,
                radius: 2.0.into(),
            },
            icon_color: color!(0x008080),
            text_color: None,
        }
    }

    fn hovered(&self, style: &Self::Style, is_checked: bool) -> checkbox::Appearance {
        self.active(style, is_checked)
    }
}

impl From<CustomTheme> for Theme {
    fn from(_: CustomTheme) -> Self {
        Theme::default()
    }
}

impl From<CustomTheme> for Box<dyn application::StyleSheet<Style = ()>> {
    fn from(theme: CustomTheme) -> Self {
        Box::new(theme)
    }
}

impl From<CustomTheme> for Box<dyn container::StyleSheet<Style = ()>> {
    fn from(theme: CustomTheme) -> Self {
        Box::new(theme)
    }
}

impl From<CustomTheme> for Box<dyn button::StyleSheet<Style = ()>> {
    fn from(theme: CustomTheme) -> Self {
        Box::new(theme)
    }
}

impl From<CustomTheme> for Box<dyn text::StyleSheet<Style = ()>> {
    fn from(theme: CustomTheme) -> Self {
        Box::new(theme)
    }
}

impl From<CustomTheme> for Box<dyn text_input::StyleSheet<Style = ()>> {
    fn from(theme: CustomTheme) -> Self {
        Box::new(theme)
    }
}

impl From<CustomTheme> for Box<dyn checkbox::StyleSheet<Style = ()>> {
    fn from(theme: CustomTheme) -> Self {
        Box::new(theme)
    }
}
