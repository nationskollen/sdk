;(function () {
    const toggle = document.getElementById('tsd-toggle-theme')

    if (window.localStorage.getItem('dark') || window.sessionStorage.getItem('dark')) {
        document.body.classList.add('dark')
        window.localStorage.setItem('dark', 'true')
        window.sessionStorage.setItem('dark', 'true')
        toggle.checked = true
    }

    toggle.addEventListener('change', function (e) {
        if (e.target.checked) {
            document.body.classList.add('dark')
            window.localStorage.setItem('dark', 'true')
            window.sessionStorage.setItem('dark', 'true')
        } else {
            document.body.classList.remove('dark')
            window.localStorage.removeItem('dark')
            window.sessionStorage.removeItem('dark')
        }
    })
})()
