$(document).ready(function() {
    $('#cog').click(function() {
        $('#modal').removeClass('close-modal');
        $('#modal').css('display','block');
        setTimeout(function() {
            $('#modal').addClass('show-modal');
        }, 10);
        $('#settings').focus();
    });


    $(document).keyup(function(event) {
        if ($('#modal').css('display') === 'block') {
            var x = event.which || event.keyCode;
            if (x === 27) {
                closeModal();
            }
        }
    });

    $('#close-btn').click(closeModal);

    function closeModal() {
        $('#modal').removeClass('show-modal');
        $('#modal').addClass('close-modal');
        setTimeout(function() {
            $('#modal').css('display','none');
        }, 400);
    }

});
