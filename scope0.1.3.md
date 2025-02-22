I want to create a meeting management tool, it contains a main page which interacts with the users and a stats page which can be accessed via /stats, 

The main page has below features:
1. user can create a meeting, 
2. a meeting has below fields for user to manually fill in:
   - date
   - title
   - created by
3. a meeting also has a participants field, which is automatically populated with the names of the users who have the meeting role "participant"
4. a meeting has agenda section, which contains below fields:
   - topic Number, e.g. 1,2,3,4, auto generated when user add a new topic
   - Topic, free text field for user to input
   - Objective for each topic, this field is a dropdown list of a set of predefined objectives and a custom objective text field. The custom objective text field is only available when the user selects the "Other" option in the dropdown list. The predefined objectives are:
    -- FYI
    -- Require feedback
    -- Require action
    -- Require decision
    -- Require approval
   - a Audience field, free text field for user to input names, when user add names to this field, the names will be automatically added to the participants field in the meeting which is defined at point 3
4. at the top of the page, on the right corner, there is a "Copy" button, when user click the button, meeting details will be copied to the clipboard as rich text and can be pasted to other apps such as Outlook, or emails. After copied, there is a small text next to the button saying "Copied!"
5. user can sign in and save the meeting to their account, at the top of the page, on the right corner, there is a "Sign in" button, when user click the button, a pop up window will show up for user to sign in with their email address and password, after successful sign in, 
    - there will be new "Share" button appear on the top right corner, when user click the button, the URL to this meeting will be copied to the clipboard as well as displayed on the screen, user can then share the URL to others.
    - there will be a "sign out" button appear on the top right corner, when user click the button, user will be signed out and the "share" button will disappear and only the "copy" button will be visible


The /stats page has below features:
1. Stats page, which contains below information:
   - total number of meetings created all time
   - total number of meetings created per day
   - total number of users registered all time
   - total number of users registered per day
   - the list of the meeting objectives, including predefined objectives and custom objectives that are added by users


The website needs to be responsive for desktop and mobile view.
All UI have modern and flat design. Design is minimalistic and clean.

