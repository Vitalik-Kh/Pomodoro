$(document).ready(function() {
    $('#cog').click(showModal);

    $(document).keyup(function(event) {
        if ($('#modal').css('display') === 'block') {
            var x = event.which || event.keyCode;
            if (x === 27 || x === 13) {
                closeModal();
            }
        }
    });

    $('#close-btn').click(closeModal);

    function showModal() {
        $('#modal').removeClass('close-modal');
        $('#modal').css('display','block');
        setTimeout(function() {
            $('#modal').addClass('show-modal');
        }, 10);
        $('#settings').focus();
    }

    function closeModal() {
        $('#modal').removeClass('show-modal');
        $('#modal').addClass('close-modal');
        setTimeout(function() {
            $('#modal').css('display','none');
        }, 400);

        inputValidation();
    }

    //Pomodoro Timer
    var pomDuration = $('#pom-duration').val();
    var breakDuration = $('#break-duration').val();
    var sessionType = 'pomodoro';

    //start button/pomodoro states
    $('#left-btn').data('state', { 'stoped':true, 'paused':false });
    $('#left-btn').click(function() {
        var leftBtn = $(this).data('state');
        if (leftBtn.stoped && !leftBtn.paused) {
            if (sessionType === 'pomodoro') {
                startTimer(pomDuration);
            } else { startTimer(breakDuration); }
            leftBtn.stoped = false;
            $(this).text('Pause');
        } else if (!leftBtn.stoped && !leftBtn.paused) {
            leftBtn.paused = true;
            $(this).text('Resume').css('font-size','1.4em');
        } else if (!leftBtn.stoped && leftBtn.paused) {
            leftBtn.paused = false;
            $(this).text('Pause').css('font-size','1.9em');
        }
    });

    //start timer function
    function startTimer(duration) {
        var leftBtn = $('#left-btn').data('state');
        if (leftBtn.stoped === true) {
            leftBtn.stoped = false;
            var stopTime = new Date().getTime() + (duration * 60 * 1000);
            var progress_percents = 0;
            var progress_deg;
            var step_in_percents = 100 / (duration * 60 * 1000);
            var id = setInterval(function() {
                var distance = stopTime - new Date().getTime();
                if (leftBtn.paused === false) {
                    var min = zeroBefore(Math.floor(distance / (1000 * 60)));
                    var sec = zeroBefore(Math.floor(distance % (1000 * 60) / 1000));
                    $('#timer').text(min + ":" + sec);
                    progress_percents += step_in_percents/2;
                    progress_deg = progress_percents * 360;
                    rotate(progress_deg);
                    document.title = min + ':' + sec + ' Pomodoro';
                } else {
                    stopTime += 100;
                }
                if (distance <= 100) {
                    clearInterval(id)
                    notification();
                    leftBtn.stoped = true;
                    leftBtn.paused = false;
                    if (sessionType === 'pomodoro') {
                        return startBreak();
                    } else { return startPomodoro(); }

                } else if ($('#right-btn').data('clicked')) {
                    clearInterval(id)
                    leftBtn.stoped = true;
                    leftBtn.paused = false;
                    $('#right-btn').data('clicked', false);
                    startPomodoro();
                }
            }, 100);
        }
    }

    //if stop button was clicked
    $('#right-btn').click(function() {
        var leftBtn = $('#left-btn').data('state');
        if (!leftBtn.stoped) {
            $(this).data('clicked', true); }
        if (leftBtn.stoped && sessionType === 'break') {
            startPomodoro();
        }
    });

    //return double digit value
    function zeroBefore(x) {
        if (x < 10) {
            return "0" + x;
        } else { return x }
    }

    function inputIsValid(x) {
        if (parseInt(x) !== NaN) {
            if (x >= 1 && x <= 60) {
                return true;
            } else { return false }
        }
    }

    function inputValidation() {
        tempPom = Math.round($('#pom-duration').val());
        tempBreak = Math.round($('#break-duration').val());

        if (inputIsValid(tempPom)) {
            pomDuration = tempPom;
            $('#pom-duration').val(tempPom);
        } else { showMessage('Wrong input','#e2601d','Choose timer between 1 to 60 minutes'); }

        if (inputIsValid(tempBreak)) {
            breakDuration = tempBreak;
            $('#break-duration').val(tempBreak);
        } else { showMessage('Wrong input','#e2601d','Choose timer between 1 to 60 minutes'); }

        if ($('#left-btn').data('state').stoped === true) {
            if (sessionType === 'pomodoro') {
                $('#timer').text(zeroBefore(pomDuration) + ':00');
            } else {
                $('#timer').text(zeroBefore(breakDuration) + ':00');
            }
        }
    }

    function showMessage(title, color, text='') {
        $('#message').css({'display':'block', 'color':color}).removeClass('hide-message').addClass('show-message');
        $('#m-title').text(title);
        $('#m-text').text(text);
        setTimeout(function() {
            $('#message').removeClass('show-message').addClass('hide-message');

        }, 3000);
        setTimeout(function() {
            $('#message').css('display','none');
        }, 4500);
    }

    //radial progress
    var transform_styles = ['-webkit-transform',
                            'ms-transform',
                            'transform'];
    function rotate(x) {
        var rotation = x;
        var rotation_fix = rotation * 2;
        for(i in transform_styles) {
            $('.circle .fill, .circle .mask.full').css(transform_styles[i],
                         'rotate(' + rotation + 'deg)');
            $('.circle .fill.fix').css(transform_styles[i], 'rotate(' + rotation_fix + 'deg)');
        }
    }

    //audio notification
    function notification() {
        var filename = 'audio/ding_ling';
        $('#sound').html('<audio autoplay="autoplay"><source src="' + filename + '.mp3" type="audio/mpeg" /><source src="' + filename + '.ogg" type="audio/ogg" /><embed hidden="true" autostart="true" loop="false" src="' + filename +'.mp3" /></audio>');
    }

    function startBreak() {
        rotate(0);
        document.title = breakDuration + ':00 Pomodoro';
        $('#left-btn').text('Start').css('font-size','1.9em');
        $('#right-btn').text('Skip');
        $('#timer').text(zeroBefore(breakDuration) + ':00');
        $('#watch').css('background', '#1de2b2');
        sessionType = 'break';
    }

    function startPomodoro() {
        rotate(0);
        document.title = pomDuration + ':00 Pomodoro';
        $('#left-btn').text('Start').css('font-size','1.9em');
        $('#right-btn').text('Stop');
        $('#timer').text(zeroBefore(pomDuration) + ':00');
        $('#watch').css('background', '#e2c21d');
        sessionType = 'pomodoro';
    }
    startPomodoro();
});
