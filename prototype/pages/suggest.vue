<template>
  <div>
    Hello.
  
    Would you like to suggest a Supported Studio?

    Please reach out with a message to <a href="mailto:severin@supported-studios.com">severin@supported-studios.com</a>.
    
    ... or submit the form below. All information in the form is optional.
    <!-- <textarea rows="7">
      Your name:

      Your email:


    </textarea> -->
    <form>
      <fieldset>
        <label for="your-name"><em>What is your name?</em></label>
        <input type="text" name="your-name" />
      </fieldset>
      <fieldset>
        <label for="your-name"><em>Can I contact you?</em></label>
        <input type="text" name="your-name" />
      </fieldset>
      <fieldset>
        <label for="name"><em>What is the name of the studio?</em></label>
        <input type="text" name="name" />
      </fieldset>
      <fieldset>
        <label for="address"><em>Where is the studio?</em></label>
        <textarea name="address" rows="4"></textarea>
      </fieldset>
      <fieldset>
        <label for="address"><em>Does the studio have a website?</em></label>
        <input name="address" type="text" />
      </fieldset>
      <fieldset>
        <label for="maps"><em>Is the studio on Google Maps?</em></label>
        <input type="text" name="maps"/>
      </fieldset>
      <button>Submit</button>
    </form>
  </div>

  <div>
    Thank you very much.
  </div>

  <a href="/">Back to home</a>
</template>

<script setup>
</script>