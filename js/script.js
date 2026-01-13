document.addEventListener("DOMContentLoaded", () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]')
    anchorLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault()
            const targetId = this.getAttribute("href").substring(1)
            const targetElement = document.getElementById(targetId)
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                })
                const navList = document.querySelector(".nav__list")
                if (navList.classList.contains("nav__list--active")) {
                    navList.classList.remove("nav__list--active")
                }
            }
        })
    })

    const burgerButton = document.querySelector(".header__burger")
    const navList = document.querySelector(".nav__list")
    if (burgerButton) {
        burgerButton.addEventListener("click", function () {
            navList.classList.toggle("nav__list--active")
            this.classList.toggle("active")
        })
    }

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".header")) {
            navList.classList.remove("nav__list--active")
        }
    })

    const contactForm = document.getElementById("contact-form")
    
    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault()
            
            const nameInput = document.getElementById("name")
            const emailInput = document.getElementById("email")
            const messageInput = document.getElementById("message")
            const submitButton = contactForm.querySelector('button[type="submit"]')
            const successMessage = document.getElementById("form-success")

            const name = nameInput.value.trim()
            const email = emailInput.value.trim()
            const message = messageInput.value.trim()
            
            if (successMessage) {
                successMessage.style.display = "none"
            }
            
            clearErrors()
            let isValid = true

            if (!name) {
                showError("name", "Пожалуйста, введите ваше имя")
                isValid = false
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!email) {
                showError("email", "Пожалуйста, введите ваш email")
                isValid = false
            } else if (!emailRegex.test(email)) {
                showError("email", "Пожалуйста, введите корректный email")
                isValid = false
            }

            if (!isValid) return

            const replytoField = document.getElementById("_replyto_field")
            if (replytoField && email) {
                replytoField.value = email
            }

            const originalButtonText = submitButton.textContent
            submitButton.textContent = "Отправка..."
            submitButton.disabled = true

            try {
                const formData = new FormData(contactForm)
                
                const response = await fetch("https://formspree.io/f/mykkyojb", {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Accept": "application/json"
                    }
                })

                if (response.ok) {
               
                    if (successMessage) {
                        successMessage.style.display = "block"
                        successMessage.style.animation = "fadeIn 0.5s"
                    }
                    
                    
                    contactForm.reset()
                    
                    setTimeout(() => {
                        if (successMessage) {
                            successMessage.style.display = "none"
                        }
                    }, 5000)
                } else {
                    const result = await response.json()
                    if (result.errors && result.errors[0]) {
                        alert("Ошибка: " + result.errors[0].message)
                    } else {
                        throw new Error("Ошибка отправки формы")
                    }
                }
            } catch (error) {
                console.error("Ошибка:", error)
                showError("form", "Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или свяжитесь по телефону.")
            } finally {
                
                submitButton.textContent = originalButtonText
                submitButton.disabled = false
            }
        })
    }

    function showError(fieldName, errorMessage) {
        if (fieldName === "form") {
          
            alert(errorMessage)
        } else {
          
            const errorElement = document.getElementById(fieldName + "-error")
            const inputElement = document.getElementById(fieldName)

            if (errorElement) {
                errorElement.textContent = errorMessage
                errorElement.style.display = "block"
            }

            if (inputElement) {
                inputElement.style.borderColor = "#d32f2f"
            }
        }
    }

    function clearErrors() {
        const errorElements = document.querySelectorAll(".form__error")
        const inputElements = document.querySelectorAll(".form__input, .form__textarea")

        errorElements.forEach((error) => {
            error.textContent = ""
            error.style.display = "none"
        })

        inputElements.forEach((input) => {
            input.style.borderColor = ""
        })
    }

    const formInputs = document.querySelectorAll(".form__input, .form__textarea")
    formInputs.forEach((input) => {
        input.addEventListener("input", function () {
            const errorElement = document.getElementById(this.id + "-error")
            if (errorElement) {
                errorElement.textContent = ""
                errorElement.style.display = "none"
            }
            this.style.borderColor = ""
        })
    })
})