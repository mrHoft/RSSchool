# 0
Hi. In this presentation i'll tell how to use modals in frontend development.

# 1
You can se a simple modal window example.
Let's learn how to make it and add to your application.

# 2
There is many methods.
We will figure it out on simple example based on class.
It is a common js class declaration.
We have a class, its constructor and private field, named "element", that contain a link to our future modal element.

# 3
Le's add a public getter, that provide a link outside of class.

# 4
Next we have to improve our constructor to let him create all needed elements:
- Base element, that will be hidden from the beginning
- Wrapper element for our future content
- And modal window appearance element

# 5
Let's also prepare a 'cross' button, that will be placed in the top-right corner of the modal window to make it possible to close.

# 6
Now let's create class methods:
- public close method, that hides modal

# 7
- private 'handleClick' event handler
It is simple but very handy cause it make possible to close modal by simply clicking outside the modal window area.

# 8
And the most importand method that shows our modal.
It is public.
As you can see, this method receives a fragmanet: any element with child components.
Such as: authentication forms, announces, presales, or any other.
Take your attention on replaceChildren method: it make us possible to use one modal for different content simply replacing it.

# 9
Let's see what we have:
- Link to the assets assigned using a constant
- Click handlers
- Simple export at the bottom makes aceecesible only one instance of the class

# 10
Now what about styles?
At first, let's look at styles for the base component:
It must cover all the viewport and it is semi-transparent to make all covered elements partially visible.
Do not forget to set high layer index to cover possible elements with setted z-index.

# 11
Lt's define animation property to make it to appear smoothly.
Or any other animation: slide up, or 3d rotate for example.

# 12
Now styles for window.
It must have position: relative; property to set position of the close button.

# 13
Set close button position to the top-right of the window.
cursor: pointer; property and hover effect to make it visually interactive.

# 14
Styles for 'cross' image of the button.

# 15
And dark theme support to make it responsive to current theme.

# 16
There is styles.css file with all needed styles.

# 17
Now we have modal.js, styles.css and here is .svg file with close button image.

# 18
To use modal we must first add it to the document.
Established practice is to add it to the bottom of the <body> element.
As you remember, our modal class have a getter, that provide a link to it.

# 19
We allready have modal element as part of our document.
Now we need to create its content and make it visible.

# 20
To make modal wisible we have already implemented show method.

# 21
Now create content.
This example function creates two elements: header and paragraph,
wrapped in to document fragment to make it easyer to pass on .show method.

# 22
We can now make a button that calls modal by click on it.
Let's test it. Good:
- Modal window smoothly appear on the screen.
- It have header.
- Some text.
- And close button, that can hide modal window.

# 23
Let's summarize:
- We have only one modal window component.
- It can be called from any part of application.
- Its content dynamic and can be set using .show method.
- Clicking outside of window can also hide it.
- Clicking inside of window have no effect. It can be usefull in user input.
- As dynamic part in this example used counter, that rises each modal window call.

Now you can easily implement your own modal window with dynamic content.
Enjoy and thanks for watching!
