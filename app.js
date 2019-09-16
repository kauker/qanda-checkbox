(function( $ ) {
 
    $.fn.qanda = function(options) {
 
        var settings = $.extend({
            // These are the defaults.
            container: "#root",
            data: {}
        }, options );
        
        var $row,
            $progressCol,
            $qandaCol,
            dialog,
            $form,
            $groupsOverlay;
        var answers = {};
        var currentGoupId = null,
            currentQuestionId = null,
            selectedOption;
        var groups = settings.data.groups,
            questions = settings.data.questions,
            categories = settings.data.categories;
        function render() {
            $row = $('<div class="row"></div>');
            $progressCol = $('<div class="col-sm-4 progress-container"><div class="progress-inner"><ul class="bars"></ul></div></div>');
            $qandaCol = $('<div class="col-sm-8 qanda"></div>');
            var $container = $('<div class="container-fluid qanda-container"></div>');
            $(settings.container)
            .empty()
            .append($container.append($row));

            $row.append($progressCol);
            $row.append($qandaCol);
            var $ul = $('<ul class="questions"></ul>');
            $qandaCol.append($ul);

            $qandaCol.on('click', 'button.option', onAnswerClick);
            $qandaCol.on('click', 'button.continue', onContinueClick);
            initDialog();
        }

        function renderCategories() {
            $categoriesOverlay = $('<div class="categories-overlay">Categories</div>');
            var $row = $('<div class="row"></div>');
            $categoriesOverlay.append($row);
            Object.keys(categories).forEach(function(id) {
                var $catCol = $('<div class="col-md-3 cat-col"><h3>' + categories[id]['name'] + '</h3></div>');
                $catCol.append('<ul class="group-names"></ul>');
                Object.keys(groups).forEach(function(groupId) {
                    var groupCategories = groups[groupId]['categories'].split(',')
                    if (groupCategories.indexOf(id) > -1) {
                        $catCol.find('ul').append('<li class="' + groupId + '">' + groups[groupId]['group_name'] +'</li>')
                    }
                })
                $row.append($catCol)
            })

            $qandaCol.append($categoriesOverlay)
        }

        function hideCategoriesOverlay(groupId) {
            // highlight rendered group name
            $categoriesOverlay.find('ul.group-names > li.' + groupId).addClass('active');
            setTimeout(function(){
                $categoriesOverlay.fadeOut("slow");
            }, 3000)
        }

        function renderProgressBar(groupId) {
            var numAnswers = 0,
                totalQuestions = groups[groupId].questions.split(',')
                    .filter(function(key) {
                        return !questions[key].hidden || (questions[key].hidden && renderedHiddenQuestions[questions[key]['request_id']])
                    }).length;

            $progressCol.find('ul')
            .append('<li class="'  + groupId + '">' +
                '<h3>' + groups[groupId].group_name + '</h3>' +
                '<div class="progress">' +
                    '<div class="progress-bar" style="width:' + numAnswers / totalQuestions * 100 + '%;">' + '</div>' +
                '</div>' + 
                '<span>' + numAnswers + ' of ' + totalQuestions + '</span>' +
            '</li>')
        }

        function updateProgressBar() {
            var numAnswers = Object.keys(answers[currentGoupId]).length,
                totalQuestions = groups[currentGoupId].questions.split(',')
                    .filter(function(key) {
                        return !questions[key].hidden || (questions[key].hidden && renderedHiddenQuestions[questions[key]['request_id']])
                    }).length;

            $progressCol.find('.' + currentGoupId + ' .progress-bar')
                .animate(
                    {width: numAnswers / totalQuestions * 100 + '%'}, 
                    {duration: 200, easing:'linear'}
                );
            
            $progressCol.find('.' + currentGoupId + ' span').text(numAnswers + ' of ' + totalQuestions)
        }

        function setActiveProgressBar() {
            $progressCol.find('li.' + currentGoupId)
                .addClass('active')
                .siblings()
                .removeClass('active')
        }

        function getQuestionsHtml(groupId) {
            var questionsHtml = '';
            var groupQuestions = groups[groupId].questions.split(',');
            var questionKeys = Object.keys(questions)
                .filter(function(key) { 
                    return groupQuestions.indexOf(key) > -1 && !questions[key].hidden
                });
            function replaceTemplatedKey (m, key) {
                return groups[groupId].hasOwnProperty(key) ? groups[groupId][key] : "";
                }
            var finalDescription = settings.data.finalMessage.description
                .replace(/{{(\w*)}}/g, replaceTemplatedKey)

            var startDescription = settings.data.startMessage.description
                .replace(/{{(\w*)}}/g, replaceTemplatedKey)

            var startMessage = '<li class="start-message current">' + 
                '<div class="question">' +
                '<h2>' + settings.data.startMessage.label + '</h2>' + 
                '<p>' + startDescription + '</p>' +
                '<div class="text-center">' +
                '<button class="btn btn-info btn-lg continue" data-group-id="' + groupId + '">' + 'Get started' + '</button>';
                '</div>' +
                '</li>';
            var startLi = $qandaCol.find('ul li.start-message');
                if (!startLi.length) questionsHtml += startMessage;

            for (var i = 0; i < questionKeys.length; i++){
                var key = questionKeys[i]
                var q = questions[key];
                var label = '';
                if (q.label) label = '<span class="label-text">' + q.label + '</span>';
                questionsHtml += '<li data-question-id="' + key + '">' + 
                '<div class="question">' +
                label +
                '<h2 class="title">' + q.question + '</h2>' +
                '<p class="description">' + q.description + '</p>' +
                '<div class="options">' + Object.keys(q.options).map(key => q.options[key]).map(renderOption).join("") + '</div>' +
                '</li>';
            }

            var finalMessage = '<li class="final-message">' + 
            '<div class="question">' +
            '<h2>' + settings.data.finalMessage.label + '</h2>' + 
            '<p>' + finalDescription + '</p>' +
            '</li>';
            questionsHtml += finalMessage;

            return questionsHtml;
        }

        function renderQuestions(groupId) {
            var questionsHtml = getQuestionsHtml(groupId);
            $qandaCol.find('ul.questions').append(questionsHtml);
        }

        function renderOption(opt, i) {
            return '<button class="btn btn-default btn-lg option" data-opt="' + opt.value + '" data-action="' + opt.action + '">' + opt.label + '</button>';
        }

        function renderNextButton(groupId) {
            var finalLi = $qandaCol.find('ul li.final-message').last();
            if (finalLi.length) finalLi.find('.question').append('<button class="btn btn-success btn-lg continue" data-group-id="' + groupId + '">' + 'Continue' + '</button>');
        }

        function scrollToNextQuestion() {
            var $nextLi = $qandaCol.find('li.current');
            $qandaCol.scrollTo($nextLi, 900);

        }

        function onAnswerClick() {
            selectedOption = $(this).data('opt');
            if ($(this).data('action') === true) {
                $(this).addClass('btn-answer');
                dialog.find( "textarea" ).val('');
                dialog.dialog("option", "title", questions[currentQuestionId].question);
                dialog.dialog('open');
            } else {
                if (!answers[currentGoupId][currentQuestionId]){
                    $(this).addClass('btn-answer')
                    setAnswer(selectedOption);
                }
            }
        }

        function setAnswer(val) {
            answers[currentGoupId][currentQuestionId] = val;
            var $nextLi = $qandaCol.find('li.current')
                .removeClass('current')
                .next()
                .addClass('current');

            currentQuestionId = $nextLi.data('question-id');

            scrollToNextQuestion();
            
            updateProgressBar();
        }

        function onContinueClick() {
            // var i = $(this).parents('li.current').index();
            var $nextLi = $(this).parents('li.current')
                .removeClass('current')
                .next()
                .addClass('current');
            $qandaCol.scrollTo($nextLi, 900);

            currentGoupId = $(this).data('group-id');
            setActiveProgressBar();
            if (!answers[currentGoupId]) answers[currentGoupId] = {};
            currentQuestionId = $nextLi.data('question-id');
        }

        function initDialog() {
            $form = $('<div id="dialog-form">' +
            '<p class="validateTips">All form fields are required.</p>' +
            '<form>' +
                '<label for="message">Your answer</label>' +
                '<textarea name="message" id="message" rows="5" class="text ui-widget-content ui-corner-all"></textarea>' +
                '<input type="submit" tabindex="-1" style="position:absolute; top:-1000px">' +
            '</form>' +
            '</div>');

            $(settings.container)
            .append($form);
            dialog = $form.dialog({
                autoOpen: false,
                closeOnEscape: false,
                height: 300,
                width: 350,
                modal: true,
                buttons: {
                  "Submit": function(){
                      var message = $form.find('textarea').val();
                      if (message) {
                        setAnswer({value: selectedOption, extra: message});
                        dialog.dialog( "close" );
                      }
                    
                  },
                },
                close: function() {
                //   form[ 0 ].reset();
                //   allFields.removeClass( "ui-state-error" );
                }
            });
        }

        function renderHiddenQuestion(key) {
            var questionsHtml = '';
            var q = questions[key];
            var label = '';
            var defaultLabel = 'Important question. Please answer';
            label = '<span class="label-text">' + (q.label || defaultLabel) + '</span>';
            questionsHtml += '<li class="current" data-question-id="' + key + '">' + 
            '<div class="question">' +
            label +
            '<h2 class="title">' + q.question + '</h2>' +
            '<p class="description">' + q.description + '</p>' +
            '<div class="options">' + Object.keys(q.options).map(key => q.options[key]).map(renderOption).join("") + '</div>' +
            '</li>';

            var $nextLi = $qandaCol.find('li.current')
                .removeClass('current');
                $(questionsHtml).insertBefore($nextLi);
                
            updateProgressBar();
            scrollToNextQuestion();
            currentQuestionId = key;

            var $overlay = $('<div class="overlay"></div>');
            $qandaCol.append($overlay);
            setTimeout(function(){
                $overlay.fadeOut("slow");
            }, 3000)
        }

        function init(groupId) {
            renderNextButton(groupId);
            renderQuestions(groupId);
            renderProgressBar(groupId); 
            if (Object.keys(renderedGoups).length <= 1) {
                // if very first group
                hideCategoriesOverlay(groupId);
                currentGoupId = groupId;
                setActiveProgressBar();
            }
        }

        function initHiddenGroup(groupId) {
            if (!Object.keys(renderedGoups).length) {
                init(groupId);
            } else {
                var questionsHtml = getQuestionsHtml(groupId);
                var $nextLi = $qandaCol.find('li.current')
                .removeClass('current');
                var $questionsHtml = $(questionsHtml);

                $questionsHtml.eq(0).addClass('current');
                // append continue button to final message
                $questionsHtml.last().find('.question').append('<button class="btn btn-success btn-lg continue" data-group-id="' + currentGoupId + '">' + 'Continue' + '</button>');
                $questionsHtml.insertBefore($nextLi);
                
                renderProgressBar(groupId);

                scrollToNextQuestion();
                currentQuestionId = groups[groupId].questions.split(',')[0];
                currentGoupId = groupId;
                answers[currentGoupId] = {};
                setActiveProgressBar();

                var $overlay = $('<div class="overlay"></div>');
                $qandaCol.append($overlay);
                setTimeout(function(){
                    $overlay.fadeOut("slow");
                }, 3000)
            }
        }

        render(); 

        renderCategories();

        var sentIds = {},
            renderedGoups = {};
            renderedHiddenQuestions = {};

        return {
            sendId: function(id) {
                sentIds[id] = sentIds[id] ? ++sentIds[id] : 1;
                var groupIds = Object.keys(groups);
                for (var i = 0; i < groupIds.length; i++) {
                    var groupId = groupIds[i];
                    var ids = groups[groupId].ids.split(',');
                    if (sentIds[ids[0]] && sentIds[ids[1]] && !renderedGoups[groupId]) {
                        renderedGoups[groupId] = true;
                        init(groupId);
                    }

                    // if hidden group
                    if (groups[groupId].hidden && ids[0] === id &&  !renderedGoups[groupId]) {
                        initHiddenGroup(groupId);
                        renderedGoups[groupId] = true;
                        
                    }
                }

                // check if it's secret question request
                if (currentGoupId) {
                    var groupQuestions = groups[currentGoupId].questions.split(',');
                    var hiddenQuestionKeys = Object.keys(questions)
                    .filter(function(key) { 
                        return groupQuestions.indexOf(key) > -1 && questions[key].hidden
                    });
                    for (var i = 0; i < hiddenQuestionKeys.length; i++) {
                        var key = hiddenQuestionKeys[i]
                        var q = questions[key];
                        if (q['request_id'] === id && !renderedHiddenQuestions[id]) {
                            renderedHiddenQuestions[id] = true;
                            renderHiddenQuestion(key);
                        }
                    }
                }
                

            },
            getResults: function() {
                return answers;
            }
        };
 
    };
 
}( jQuery ));