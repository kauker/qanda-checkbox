(function( $ ) {
 
    $.fn.qanda = function(options) {
 
        var settings = $.extend({
            // These are the defaults.
            container: "#root",
            data: {}
        }, options );
        
        var $row,
            $progressCol,
            $quizCol;
        var answers = {};
        var currentGoupId = null;
        function render() {
            $row = $('<div class="row"></div>');
            $progressCol = $('<div class="col-sm-4 progress-container"></div>');
            $quizCol = $('<div class="col-sm-8 quiz"></div>');
            var $container = $('<div class="container-fluid quiz-container"></div>');
            $(settings.container)
            .empty()
            .append($container.append($row));

            $row.append($progressCol);
            $row.append($quizCol);
        }

        function renderProgressBar() {
            var numAnswers = Object.keys(answers).length,
                totalQuestions = settings.data.groups[currentGoupId].questions.split(',').length;
            $progressCol.empty();
            $progressCol.append('<p>' + settings.data.groups[currentGoupId].group_name + '</p>');
            $progressCol.append('<div class="progress">' +
            '<div class="progress-bar" style="width:' + numAnswers / totalQuestions * 100 + '%;">' +
            '</div>' +
            '</div>' + 
            '<span>' + numAnswers + ' of ' + totalQuestions+ '</span>')
        }

        function renderQuestions() {
            var questionsHtml = '';
            var groupQuestions = settings.data.groups[currentGoupId].questions.split(',');
            var questionKeys = Object.keys(settings.data.questions)
                .filter(function(key) { 
                    return groupQuestions.indexOf(key) > -1
                });
            for (var i = 0; i < questionKeys.length; i++){
                var key = questionKeys[i]
                var q = settings.data.questions[key];
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

            var $ul = $('<ul></ul>');
            $quizCol.append($ul.append(questionsHtml));
            var finalMessage = '<li class="final-message">' + 
            '<div class="question">' +
            '<h2>' + settings.data.finalMessage.label + '</h2>' + 
            '<p>' + settings.data.finalMessage.description + '</h2>' +
            '</li>';
            $ul.append(finalMessage);
        }

        function renderOption(opt, i) {
            return '<button class="btn btn-default btn-lg" data-opt="' + opt.label + '">' + opt.label + '</button>';
        }

        function scrollToNextQuestion(e) {
            var questionId = $(this).parents('li').data('question-id');
            var i = Object.keys(answers).length;
            if (!answers[questionId]){
                $(this).addClass('btn-answer')
                answers[questionId] = $(this).data('opt');
                
                $quizCol.scrollTo($quizCol.find('ul li').eq(++i), 900);
                renderProgressBar();
            }
            
        }

        function init(groupId) {
            return function() {
                answers = {}
                currentGoupId = groupId;
                render(groupId);
                renderQuestions(groupId);
                renderProgressBar(groupId);
                $quizCol.on('click', 'button', scrollToNextQuestion);
            }
        }
              
        var sentIds = {};
        // var renderQueue = [];
        return {
            sendId: function(id) {
                sentIds[id] = sentIds[id] ? ++sentIds[id] : 1;
                var groupIds = Object.keys(settings.data.groups);
                for (var i = 0; i < groupIds.length; i++) {
                    var groupId = groupIds[i];
                    var ids = settings.data.groups[groupId].ids.split(',');
                    if (sentIds[ids[0]] && sentIds[ids[1]]) {
                        sentIds[ids[0]]--;
                        sentIds[ids[1]]--;
                        init(groupId)();
                    }
                }

            },
            getResults: function() {
                return {
                    answers: answers,
                    group_id: currentGoupId
                };
            }
        };
 
    };
 
}( jQuery ));