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
        pomDuration = $('#pom-duration').val();
        breakDuration = $('#break-duration').val();
        if ($('#left-btn').data('state').stoped === true) {
            if (sessionType === 'pomodoro') {
                $('#timer').text(pomDuration + ':00');
            } else {
                $('#timer').text(breakDuration + ':00');
            }
        }

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
            $(this).text('Resume');
        } else if (!leftBtn.stoped && leftBtn.paused) {
            leftBtn.paused = false;
            $(this).text('Pause');
        }
    });

    //start timer function
    function startTimer(duration) {
        var leftBtn = $('#left-btn').data('state');
        if (leftBtn.stoped === true) {
            leftBtn.stoped = false;
            var stopTime = new Date().getTime() + (duration * 60 * 1000);
            var id = setInterval(function() {
                var distance = stopTime - new Date().getTime();
                if (leftBtn.paused === false) {
                    var min = zeroBefore(Math.floor(distance / (1000 * 60)));
                    var sec = zeroBefore(Math.floor(distance % (1000 * 60) / 1000));
                    $('#timer').text(min + ":" + sec);
                } else {
                    stopTime += 100;
                }
                if (distance <= 1000) {
                    clearInterval(id)
                    leftBtn.stoped = true;
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
        $(this).data('clicked', true);
    });

    //return double digit value
    function zeroBefore(x) {
        if (x < 10) {
            return "0" + x;
        } else { return x }
    }

    function startBreak() {
        $('#left-btn').text('Start');
        $('#timer').text(zeroBefore(breakDuration) + ':00');
        $('#watch').css('background', '#1de2b2');
        sessionType = 'break';
    }

    function startPomodoro() {
        $('#left-btn').text('Start');
        $('#timer').text(zeroBefore(pomDuration) + ':00');
        $('#watch').css('background', '#e2c21d');
        sessionType = 'pomodoro';
    }
    startPomodoro();
});
