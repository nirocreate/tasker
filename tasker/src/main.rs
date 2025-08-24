use iced::widget::{button, checkbox, column, row, text, text_input};
use iced::{Element, Settings};
use iced::executor;
use iced::Application;
use chrono::NaiveDate;

mod theme;

pub fn main() -> iced::Result {
    Tasker::run(Settings::default())
}

#[derive(Debug, Clone)]
struct Task {
    id: usize,
    description: String,
    due_date: Option<NaiveDate>,
    completed: bool,
}

struct Tasker {
    tasks: Vec<Task>,
    new_task_description: String,
    filter: Filter,
    next_task_id: usize,
    editing: Option<usize>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Filter {
    All,
    Active,
    Completed,
}

#[derive(Debug, Clone)]
enum Message {
    NewTaskDescriptionChanged(String),
    Add,
    ToggleCompleted(usize, bool),
    Delete(usize),
    FilterChanged(Filter),
    Edit(usize),
    TaskDescriptionChanged(usize, String),
    Save(usize),
}

impl Application for Tasker {
    type Executor = executor::Default;
    type Message = Message;
    type Theme = theme::CustomTheme;
    type Flags = ();

    fn new(_flags: ()) -> (Self, iced::Command<Message>) {
        (
            Self {
                tasks: Vec::new(),
                new_task_description: String::new(),
                filter: Filter::All,
                next_task_id: 0,
                editing: None,
            },
            iced::Command::none(),
        )
    }

    fn title(&self) -> String {
        String::from("Tasker")
    }

    fn update(&mut self, message: Message) -> iced::Command<Message> {
        match message {
            Message::NewTaskDescriptionChanged(description) => {
                self.new_task_description = description;
            }
            Message::Add => {
                if !self.new_task_description.is_empty() {
                    self.tasks.push(Task {
                        id: self.next_task_id,
                        description: self.new_task_description.clone(),
                        due_date: None,
                        completed: false,
                    });
                    self.new_task_description.clear();
                    self.next_task_id += 1;
                }
            }
            Message::ToggleCompleted(id, completed) => {
                if let Some(task) = self.tasks.iter_mut().find(|task| task.id == id) {
                    task.completed = completed;
                }
            }
            Message::Delete(id) => {
                self.tasks.retain(|task| task.id != id);
            }
            Message::FilterChanged(filter) => {
                self.filter = filter;
            }
            Message::Edit(id) => {
                self.editing = Some(id);
            }
            Message::TaskDescriptionChanged(id, description) => {
                if let Some(task) = self.tasks.iter_mut().find(|task| task.id == id) {
                    task.description = description;
                }
            }
            Message::Save(id) => {
                if self.editing == Some(id) {
                    self.editing = None;
                }
            }
        }
        iced::Command::none()
    }

    fn view(&self) -> Element<Message, theme::CustomTheme> {
        let title = text("Tasker").size(40);

        let new_task_input = text_input("What needs to be done?", &self.new_task_description)
            .on_input(Message::NewTaskDescriptionChanged)
            .on_submit(Message::Add);

        let tasks: Element<Message, theme::CustomTheme> = if self.tasks.is_empty() {
            column![].into()
        } else {
            let filtered_tasks = self.tasks.iter().filter(|task| match self.filter {
                Filter::All => true,
                Filter::Active => !task.completed,
                Filter::Completed => task.completed,
            });

            column(
                filtered_tasks
                    .map(|task| {
                        let task_view = if self.editing == Some(task.id) {
                            let text_input = text_input("Edit task...", &task.description)
                                .on_input(move |desc| Message::TaskDescriptionChanged(task.id, desc))
                                .on_submit(Message::Save(task.id));
                            let save_button = button(text("Save")).on_press(Message::Save(task.id));
                            row![text_input, save_button].spacing(20).into()
                        } else {
                            let checkbox = checkbox(&task.description, task.completed)
                                .on_toggle(move |completed| Message::ToggleCompleted(task.id, completed));
                            let edit_button = button(text("Edit")).on_press(Message::Edit(task.id));
                            let delete_button = button(text("Delete")).on_press(Message::Delete(task.id));
                            row![checkbox, edit_button, delete_button].spacing(20).into()
                        };
                        task_view
                    })
                    .collect::<Vec<_>>(),
            )
            .spacing(10)
            .into()
        };

        let filter_controls = row![
            button(text("All")).on_press(Message::FilterChanged(Filter::All)),
            button(text("Active")).on_press(Message::FilterChanged(Filter::Active)),
            button(text("Completed")).on_press(Message::FilterChanged(Filter::Completed)),
        ]
        .spacing(10);

        column![title, new_task_input, tasks, filter_controls]
            .spacing(20)
            .padding(20)
            .into()
    }

    fn theme(&self) -> Self::Theme {
        theme::CustomTheme
    }
}
