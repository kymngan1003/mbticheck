(function ($) {
    var index = function () {
        var self = this;
        var lang = "vie";
        var questionList = {};
        var resultList = {};
        var questionPath = "asset/json/question.json"
        var resultPath = "asset/json/result.json"
        var userResult = [];
        var indexQuestionCurrent = 0;

        var questionSelection = $('.question-content');
        var answerASelection = $('.question-answer-a');
        var answerBSelection = $('.question-answer-b');
        function loadJSONFile(filePath) {
            return $.getJSON(filePath)
                .fail(function(jqxhr, textStatus, error) {
                    console.error('There was a problem loading the JSON file:', error);
                    throw error; // Re-throwing the error to handle it later
                });
        }

        $.when(
            loadJSONFile(questionPath),
            loadJSONFile(resultPath)
        ).done(function(jsonData1, jsonData2) {
            questionList = jsonData1[0];
            resultList = jsonData2[0];
            self.start();
        }).fail(function(error) {
            console.error('Error loading JSON files:', error);
        });

        this.start = function (){
            $('#home .home-checkBtn').click(function (){
                $('#home').removeClass('active');
                $('#result').removeClass('active');
                $('#full-result').removeClass('active');
                $('#question').addClass('active');
                self.renderQuestion(indexQuestionCurrent);
            });

            self.renderLang();

            $('#home-lang-korean').click(function (){
                lang = "korean"
                self.renderLang();
            });

            $('#home-lang-vie').click(function (){
                lang = "vie";
                self.renderLang()
            });
        }

        this.renderLang = function (){
            if (lang == "korean") {
                $('.home-introduce-text').html('당신은 어떤 유형의 사람인가요? 우리와 함께 확인해 보세요!');
                $('.home-checkBtn').html('확인하다');
                $('.result-tilte').html('놀랐는 걸, 당신은:');
                $('.result-recheck').html('다시 확인하다');
                $('.result-full').html('전체 결과 보기');
            }
            if (lang == "vie") {
                $('.home-introduce-text').html('Bạn thuộc kiểu người như thế nào? Cùng chúng tôi kiểm tra một chút nhé!');
                $('.home-checkBtn').html('Kiểm tra');
                $('.result-tilte').html('Thật bất ngờ, bạn là: ');
                $('.result-recheck').html('Kiểm tra lại');
                $('.result-full').html('Tất cả kết quả');
            }
        }
        this.renderQuestion = function (){
            var numberQuestion = indexQuestionCurrent + 1;
            if (numberQuestion <= 70){
                $(".question-numberCurrent").html(numberQuestion);
                if (lang == "korean") {
                    questionSelection.html(questionList.korean[indexQuestionCurrent].Q);
                    answerASelection.html(questionList.korean[indexQuestionCurrent].A);
                    answerBSelection.html(questionList.korean[indexQuestionCurrent].B);
                }
                if (lang == "vie") {
                    for(var i = 0; i<70; i++){
                        questionSelection.html(questionList.vie[indexQuestionCurrent].Q);
                        answerASelection.html(questionList.vie[indexQuestionCurrent].A);
                        answerBSelection.html(questionList.vie[indexQuestionCurrent].B);
                    }
                }
            }else{
                $('#home').removeClass('active');
                $('#question').removeClass('active');
                $('#full-result').removeClass('active');
                $('#result').addClass('active');
                self.renderResult();
            }
        }

        this.renderResult = function (){
            $.ajax({
                url: 'http://localhost:3000/calculateMBTI',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ array: userResult }),
                success: function(data) {
                    if (lang == "korean") {
                        if (data.mbtiNumber == -1 ){
                            $('.result-tilte').html('');
                            $('.result-content').html('오류가 발생했습니다! 다시 시도해 주세요');
                        }else {
                            $('.result-content').html(resultList[data.mbtiNumber].korean);
                        }
                    }
                    if (lang == "vie") {
                        if (data.mbtiNumber == -1 ){
                            $('.result-tilte').html('');
                            $('.result-content').html('Đã có lỗi xảy ra! Vui lòng thử lại');
                        }else {
                            $('.result-content').html(resultList[data.mbtiNumber].vie);
                        }
                    }

                },
                error: function(xhr, status, error) {
                    console.error('There was a problem with the AJAX request:', error);
                }
            });
        }

        this.renderFullResult = function(){
            $('#full-result .fullResult-list').html('');
            if (lang == "korean") {
                for(let i = 0; i<16; i++){
                    $('#full-result .fullResult-list').append('<div class="fullResult-item">' + resultList[i].korean + '</div>');
                }
            }
            if (lang == "vie") {
                for(let i = 0; i<16; i++){
                    $('#full-result .fullResult-list').append('<div class="fullResult-item">' + resultList[i].vie + '</div>');
                }
            }
        }

        //catch event
        answerASelection.click(function (){
            userResult.push("A");
            indexQuestionCurrent++;
            self.renderQuestion(indexQuestionCurrent);
        });
        answerBSelection.click(function (){
            userResult.push("B");
            indexQuestionCurrent++;
            self.renderQuestion(indexQuestionCurrent);
        });
        $('.result-recheck').click(function (){
            $('#result').removeClass('active');
            $('#full-result').removeClass('active');
            $('#question').removeClass('active');
            $('#home').addClass('active');

            indexQuestionCurrent = 0;
            userResult = [];
        });
        $('.result-full').click(function (){
            $('#home').removeClass('active');
            $('#question').removeClass('active');
            $('#result').removeClass('active');
            $('#full-result').addClass('active');
            self.renderFullResult();
        });


    };
    $(document).ready(function () {
        new index();
    });
})($);