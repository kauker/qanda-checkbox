(function( $ ) {
 
    $.fn.quiz = function(options) {
 
        var settings = $.extend({
            // These are the defaults.
            container: "#root",
            data: {}
        }, options );
        
        var $row,
            $progressCol = $('<div class="col-sm-4 progress-container"></div>'),
            $quizCol = $('<div class="col-sm-8 quiz"></div>');
        var answers = {};
        function render() {
            $row = $('<div class="row"></div>');
            var $container = $('<div class="container-fluid quiz-container"></div>');
            $(settings.container)
            .append($container.append($row));

            $row.append($progressCol);
            $row.append($quizCol);
        }

        function renderProgressBar() {
            var numAnswers = Object.keys(answers).length,
                totalQuestions = settings.data.questions.length;
            $progressCol.empty();
            $progressCol.append('<div class="progress">' +
            '<div class="progress-bar" style="width:' + numAnswers / totalQuestions * 100 + '%;">' +
            '</div>' +
            '</div>' + 
            '<span>' + numAnswers + ' of ' + totalQuestions+ '</span>')
        }

        function renderQuestions() {
            var questionsHtml = '';
            for (var i = 0; i < settings.data.questions.length; i++){
                var q = settings.data.questions[i];
                questionsHtml += '<li>' + 
                '<div class="question">' +
                '<h2 class="title">' + q.label + '</h2>' +
                '<p class="description">' + q.description + '</p>' +
                '<div class="options">' + q.options.map(renderOption).join("") + '</div>' +
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
            var text = opt;
            if (opt === true) {
                text = 'Yes';
            } else if (opt === false) {
                text = 'No';
            }
            return '<button class="btn btn-default btn-lg">' + text + '</button>';
        }

        function scrollToNextQuestion(e) {
            var l = ++Object.keys(answers).length;
            if (!answers[l]){
                $(this).addClass('btn-answer')
                answers[l] = 'haha';
                
                $quizCol.scrollTo($quizCol.find('ul li').eq(l), 1000);
                renderProgressBar();
            }
            
        }
        
        render();
        renderQuestions();
        renderProgressBar();
        $quizCol.on('click', 'button', scrollToNextQuestion)
        return this;
 
    };
 
}( jQuery ));