document.addEventListener('DOMContentLoaded', function () {
    // Get necessary elements
    const buyButtons = document.querySelectorAll('.course button.btn');
    const cartSection = document.getElementById('cartSection');
    const cartItemContainer = document.querySelector('.cart');
    const itemCountElement = document.getElementById('item');
    const checkoutButton = document.querySelector('.checkout-btn');
    const cartItems = [];
    const purchasedCourses = [];

    // Add click event listener to each "Buy Course" button
    buyButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Get course details
            const courseContainer = button.closest('.course');
            const courseName = courseContainer.querySelector('.detail').textContent;
            const courseImage = courseContainer.querySelector('.picture').src;

            // Check if the course has already been purchased
            if (isCoursePurchased(courseName, courseImage)) {
                alert('You have already purchased this course.');
                return;
            }

            // Decrease the number of seats
            const courseSeatsElement = courseContainer.querySelector('.seat p');
            const availableSeats = parseInt(courseSeatsElement.textContent);
            if (availableSeats > 0) {
                courseSeatsElement.textContent = `${availableSeats - 1} seats`;
            } else {
                alert('No more seats available for this course.');
                return;
            }

            // Add course to the cart
            const coursePrice = parseFloat(courseContainer.querySelector('.price').textContent);
            const cartItem = {
                name: courseName,
                price: coursePrice,
                image: courseImage,
                seatElement: courseSeatsElement,
            };

            // Add the course to the cartItems array
            cartItems.push(cartItem);

            // Update cart display
            updateCartDisplay();

            // Show the cart section
            cartSection.style.display = 'block';

            // Add purchased course details to the tracking array
            purchasedCourses.push({ name: courseName, image: courseImage });
        });
    });

    // Function to check if the course has already been purchased
    function isCoursePurchased(courseName, courseImage) {
        return purchasedCourses.some(course => course.name === courseName && course.image === courseImage);
    }

    function updateCartDisplay() {
        // Clear existing cart items
        cartItemContainer.innerHTML = '';

        // Calculate total cost
        let totalCost = 0;

        // Add each item to the cart display
        cartItems.forEach((item, index) => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');

            cartItemElement.innerHTML = `
            <img class="course-icon" src="${item.image}" alt="">
            <div>
                <p>${item.name}</p>
                <p class="price">${item.price} TK</p>
            </div>
            <button class="remove-btn" onclick="removeCartItem(${index})">X</button>`;

            // Append the cart item to the container
            cartItemContainer.appendChild(cartItemElement);

            // Add the item price to the total cost
            totalCost += item.price;
        });

        // Display total cost
        const hrElement = document.createElement('hr');
        cartItemContainer.appendChild(hrElement);

        const totalCostElement = document.createElement('div');
        totalCostElement.classList.add('total');
        totalCostElement.innerHTML = `
            <div>
                <p>Sub-Total</p>
                <p id="item">${cartItems.length} items</p>
            </div>
            <div>
                <p>${totalCost} TK</p>
                <button class="btn checkout-btn" onclick="checkout()">Checkout</button>
            </div>
        `;
        cartItemContainer.appendChild(totalCostElement);
    }

    // Function to remove a cart item
    window.removeCartItem = function (index) {
        if (index >= 0 && index < cartItems.length) {
            // Increase the relevant course seat by 1
            const removedCartItem = cartItems[index];
            if (removedCartItem && removedCartItem.seatElement) {
                const currentSeats = parseInt(removedCartItem.seatElement.textContent);
                removedCartItem.seatElement.textContent = `${currentSeats + 1} seats`;
            }

            // Remove the item from the cartItems array
            const removedItem = cartItems.splice(index, 1)[0];

            // Remove the item from the purchasedCourses array
            const purchasedIndexToRemove = purchasedCourses.findIndex(course =>
                course.name === removedItem.name && course.image === removedItem.image
            );
            if (purchasedIndexToRemove !== -1) {
                purchasedCourses.splice(purchasedIndexToRemove, 1);
            }

            // Update cart display
            updateCartDisplay();

            // Hide the cart section if there are no items
            if (cartItems.length === 0) {
                cartSection.style.display = 'none';
            }
        }
    };

    // Function to handle checkout
    window.checkout = function () {
        // Add purchased courses to the tracking array
        purchasedCourses.push(...cartItems.map(item => ({ name: item.name, image: item.image })));

        // Reset the cart
        cartItems.length = 0;

        // Update cart display
        updateCartDisplay();

        // Hide the cart section
        cartSection.style.display = 'none';

        alert('Checkout completed. Thank you!');
    };
});
