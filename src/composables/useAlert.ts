import Swal from 'sweetalert2'

export function useAlertLoading() {
    const show = (title: string = 'loading', html = 'Please wait...') => {
        Swal.fire({
            title: title,
            html: html,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            showCancelButton: false,
            didOpen: () => {
                Swal.showLoading()
            }
        })
    }

    const hide = () => {
        Swal.close()
    }

    return { show, hide }
}