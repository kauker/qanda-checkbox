var sample_data = {
    questions: {
        "1": {
            label: 'Special label',
            question: "What color is your favorite dog?",
            description: "Please make sure to select the breed of dog that you have",
            options: {
                1: {
                    label: "true",
                    action: ""
                },
                2: {
                    label: "false",
                    action: ""
                },
                3: {
                    label: 'Not relevant',
                    action: ""
                },
                4: {
                    label: 'Partially',
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
                    action: ""
                },
                2: {
                    label: "false",
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
                    action: ""
                },
                2: {
                    label: "false",
                    action: ""
                },
                3: {
                    label: 'Not relevant',
                    action: ""
                },
                4: {
                    label: 'Partially',
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
                    action: ""
                },
                2: {
                    label: "false",
                    action: ""
                },
                3: {
                    label: 'Not relevant',
                    action: ""
                },
                4: {
                    label: 'Partially',
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
                    action: ""
                },
                2: {
                    label: "false",
                    action: ""
                },
                3: {
                    label: 'Not relevant',
                    action: ""
                },
                4: {
                    label: 'Partially',
                    action: ""
                }
            }
        }
    },
    "groups": {
        "group_number_1" : {
             group_name: "name of group 1",
              questions: "1,2,3,4,5",
              ids : '1234,1245',
              label: '',
              description: '',
            },
        "group_number_2" : {
             group_name: 'name of group 2',
              questions: "2,4,5",
              ids : '4345,7245',
              label: '',
              description: '',
            },
    },
    finalMessage: {
        label: "Congratulations!",
        description: "You answered all questions and now can get back to your work."
    }
}