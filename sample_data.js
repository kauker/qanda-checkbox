var sample_data = {
    questions: {
        "1": {
            label: 'Special label',
            question: "What color is your favorite dog?",
            description: "Please make sure to select the breed of dog that you have",
            options: {
                1: {
                    label: "Yes",
                    value: "1",
                    action: "true"
                },
                2: {
                    label: "false",
                    value: "false",
                    action: "true"
                },
                3: {
                    label: 'Not relevant',
                    value: "Not relevant",
                    action: ""
                },
                4: {
                    label: 'Partially',
                    value: "Partially",
                    action: ""
                }
            }
        },
        "2": {
            question: "Can you see the colors of things in a box?",
            description: "Please make sure that you can see all the colors.",
            options: {
                1: {
                    label: "true",
                    value: "true",
                    action: ""
                },
                2: {
                    label: "false",
                    value: "0",
                    action: ""
                }
            }
        },
        "3": {
            label: 'Special label',
            question: "Did you know that people can sing many songs?",
            description: "Please make sure to select how many songs that you wish to sing.",
            options: {
                1: {
                    label: "true",
                    value: "true",
                    action: ""
                },
                2: {
                    label: "false",
                    value: "0",
                    action: ""
                },
                3: {
                    label: 'Not relevant',
                    value: 'Not relevant',
                    action: ""
                },
                4: {
                    label: 'Partially',
                    value: 'Partially',
                    action: ""
                }
            }
        },
        "4": {
            question: "What color is your favorite cat?",
            description: "Please make sure to select the breed of dog that you have",
            options: {
                1: {
                    label: "true",
                    value: "true",
                    action: ""
                },
                2: {
                    label: "false",
                    value: "false",
                    action: ""
                },
                3: {
                    label: 'Not relevant',
                    value: 'Not relevant',
                    action: ""
                },
                4: {
                    label: 'Partially',
                    value: 'Partially',
                    action: ""
                }
            }
        },
        "5": {
            question: "Can you see the colors of things in a cup?",
            description: "Please make sure that you can see all the colors.",
            options: {
                1: {
                    label: "true",
                    value: "true",
                    action: ""
                },
                2: {
                    label: "false",
                    value: "false",
                    action: ""
                },
                3: {
                    label: 'Not relevant',
                    value: 'Not relevant',
                    action: ""
                },
                4: {
                    label: 'Partially',
                    value: 'Partially',
                    action: ""
                }
            }
        },
        6: {
            label: 'SUPER secret',
            question: "SECRET What color is your favorite dog?",
            description: "Please make sure to select the breed of dog that you have",
            hidden: true,
            request_id: "12345",
                options: {
                    1: {
                        label: "true",
                        value: "true",
                        action: ""
                    },
                    2: {
                        label: "false",
                        value: "false",
                        action: ""
                    },
                }
        }
    },
    "groups": {
        "group_number_1" : {
             group_name: "name of group 1",
             categories: "0,1",
              questions: "1,2,3,4,5",
              ids : '1234,1245',
              label: 'label1',
              description: 'some description1',
            },
        "group_number_2" : {
             group_name: 'name of group 2',
             categories: "0,2",
              questions: "2,4,5,6",
              ids : '4345,7245',
              label: 'label2',
              description: 'some description2',
            },
        "group_number_3" : {
            group_name: 'secret group 3',
            categories: "4",
                questions: "4,5",
                ids : '5432',
                hidden: true,
                label: 'label3',
                description: 'some description3',
            },
    },
    "categories": {
        0: {
            name: 'Cats'
        },
        1: {
            name: 'Dogs'
        },
        2: {
            name: 'Sharks'
        },
        3: {
            name: 'Animals'
        },
        4: {
            name: 'Birds'
        }
    },
    startMessage: {
        label: "Welcome!",
        description: "Please take our quiz. Press button to proceed to questions. Good luck. Details: {{group_name}}... Group label: {{label}}. Group description = {{description}}"
    },
    finalMessage: {
        label: "Congratulations!",
        description: "You answered all questions and now can get back to your work. You just finished {{group_name}}."
    }
}