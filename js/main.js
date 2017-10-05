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
    var pom_messages = ['Lets do some work!',
                        'Go tiger! Do it!',
                        'Just do it!',
                        'Smash it this session!',
                        'You are the best!',
                        "It's work time!"];
    var break_messages = ['Have a break!',
                          'Time to chill!',
                          'Now do nothing!',
                          'Maybe short meditation?',
                          'Time to find a couch!',
                          'Break time!'];

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
        } else if (!leftBtn.paused) {
            leftBtn.paused = true;
            $(this).text('Resume').css('font-size','1.4em');
        } else if (leftBtn.paused) {
            leftBtn.paused = false;
            leftBtn.stoped = true;
            $(this).text('Pause').css('font-size','1.9em');
            startTimer(remaining_distance);
        }
    });
    var remaining_distance;
    var finished_distance = 0;
    //start timer function
    function startTimer(duration) {
        var leftBtn = $('#left-btn').data('state');
        if (leftBtn.stoped === true) {
            leftBtn.stoped = false;
            if (duration <= 60) {
                duration_in_ms = duration * 60 * 1000;
            } else { duration_in_ms = duration }
            var stopTime = new Date().getTime() + duration_in_ms;
            var duration_in_ms;
            var passed_time;
            var progress_deg;

            var id = setInterval(function() {
                var distance = stopTime - new Date().getTime();
                if (leftBtn.paused === false) {
                    var min = zeroBefore(Math.floor(distance / (1000 * 60)));
                    var sec = zeroBefore(Math.floor(distance % (1000 * 60) / 1000));
                    $('#timer').text(min + ":" + sec);
                    passed_time = finished_distance + duration_in_ms - distance;
                    progress_deg = passed_time/(duration_in_ms + finished_distance) * 180;
                    rotate(progress_deg);
                    document.title = min + ':' + sec + ' Pomodoro';
                } else {
                    remaining_distance = distance;
                    finished_distance += duration_in_ms - distance;
                    clearInterval(id);
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
                    return startPomodoro();
                }
            }, 100);
        }
    }

    //if stop button was clicked
    $('#right-btn').click(function() {
        var leftBtn = $('#left-btn').data('state');
        if (!leftBtn.stoped) {
            $(this).data('clicked', true); }
        if (sessionType === 'break') {
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
        var tempPom = Math.round($('#pom-duration').val());
        var tempBreak = Math.round($('#break-duration').val());
        var color = 'rgba(216,39,39,0.9)';
        if (inputIsValid(tempPom)) {
            pomDuration = tempPom;
            $('#pom-duration').val(tempPom);
        } else { showMessage('Wrong input',color,'Choose timer between 1 to 60 minutes'); }

        if (inputIsValid(tempBreak)) {
            breakDuration = tempBreak;
            $('#break-duration').val(tempBreak);
        } else { showMessage('Wrong input',color,'Choose timer between 1 to 60 minutes'); }

        if ($('#left-btn').data('state').stoped === true) {
            if (sessionType === 'pomodoro') {
                $('#timer').text(zeroBefore(pomDuration) + ':00');
            } else {
                $('#timer').text(zeroBefore(breakDuration) + ':00');
            }
        }
    }

    function showMessage(title, color, text='') {
        $('#message').css({'display':'block', 'backgroundColor':color}).removeClass('hide-message').addClass('show-message');
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
        var rotation_fix = x * 2;
        for(i in transform_styles) {
            $('.circle .fill, .circle .mask.full').css(transform_styles[i],
                         'rotate(' + rotation + 'deg)');
            $('.circle .fill.fix').css(transform_styles[i], 'rotate(' + rotation_fix + 'deg)');
        }
    }

    //audio notification
    function notification() {
        var audio = document.getElementById('sound');
        audio.play();
    }

    //messages on the start of each pomodoro or break
    function sessionMessage() {
        finished_distance = 0;
        var pom_color = 'rgba(226, 194, 29, 0.9)';
        var break_color = 'rgba(29, 226, 178, 0.9)';
        var x = Math.floor(Math.random() * 6);
        if (sessionType === 'pomodoro') {
            showMessage(pom_messages[x], pom_color);
        } else { showMessage(break_messages[x], break_color) }
    }

    function startBreak() {
        finished_distance = 0;
        sessionType = 'break';
        sessionMessage();
        rotate(0);
        document.title = breakDuration + ':00 Pomodoro';
        $('#left-btn').text('Start').css('font-size','1.9em');
        $('#right-btn').text('Skip');
        $('#timer').text(zeroBefore(breakDuration) + ':00');
        $('#watch').css('background', '#1de2b2');
    }

    function startPomodoro() {
        sessionType = 'pomodoro';
        sessionMessage()
        rotate(0);
        document.title = pomDuration + ':00 Pomodoro';
        $('#left-btn').text('Start').css('font-size','1.9em');
        $('#right-btn').text('Stop');
        $('#timer').text(zeroBefore(pomDuration) + ':00');
        $('#watch').css('background', '#e2c21d');
    }
    startPomodoro();
});
