import React from 'react';
import './WalkthroughModal.css';

const WalkthroughModal = ({ step, onNext, onPrevious, onClose }) => {
  const steps = [
    {
      title: 'Introduction to **kwargs',
      content: (
        <div>
          <p>The <code>**kwargs</code> argument allows you to pass a variable number of keyword arguments to a function. This can be useful for making your functions more flexible.</p>
          <pre><code>
{`def example_function(**kwargs):
    # Access kwargs like a dictionary
    value = kwargs.get('key', default_value)
    print(value)
`}
          </code></pre>
        </div>
      )
    },
    {
      title: 'Example Code Structure',
      content: (
        <div>
          <p>Our example codes for <code>personCount</code> and <code>carCount</code> follow a similar structure:</p>
          <pre><code>
{`def function_name(**kwargs):
    # Access the arguments
    value = kwargs.get('key', default_value)
    # Perform operations
    print(f"Detected: {value}")
    return value

# Example usage:
data = {'key': value}
function_name(**data)
`}
          </code></pre>
        </div>
      )
    },
    {
      title: 'Detailed Walkthrough: personCount',
      content: (
        <div>
          <p>Let's take a closer look at the <code>personCount</code> function:</p>
          <pre><code>
{`def personCount(**kwargs):
    people_detected = kwargs.get('people_detected', 0)
    print(f"Number of people detected: {people_detected}")
    return people_detected

# Example usage:
data = {'people_detected': 5}
personCount(**data)
`}
          </code></pre>
          <p>In this example, <code>people_detected</code> is retrieved from the <code>kwargs</code> dictionary. If it's not provided, the default value is 0. The function then prints the number of people detected and returns this value.</p>
          <p>Users should expect the following key in <code>**kwargs</code> for this function:</p>
          <ul>
            <li><code>people_detected</code>: The number of people detected (integer).</li>
          </ul>
        </div>
      )
    },
    {
      title: 'Detailed Walkthrough: carCount',
      content: (
        <div>
          <p>Now, let's look at the <code>carCount</code> function:</p>
          <pre><code>
{`def carCount(**kwargs):
    cars_detected = kwargs.get('cars_detected', 0)
    print(f"Number of cars detected: {cars_detected}")
    return cars_detected

# Example usage:
data = {'cars_detected': 3}
carCount(**data)
`}
          </code></pre>
          <p>Similarly, <code>cars_detected</code> is retrieved from the <code>kwargs</code> dictionary with a default value of 0 if not provided. The function prints the number of cars detected and returns this value.</p>
          <p>Users should expect the following key in <code>**kwargs</code> for this function:</p>
          <ul>
            <li><code>cars_detected</code>: The number of cars detected (integer).</li>
          </ul>
        </div>
      )
    },
    {
      title: 'Handling Detection Results',
      content: (
        <div>
          <p>Based on the detection results format, users should expect the <code>**kwargs</code> to include data similar to the following:</p>
          <pre><code>
{`{
  "frame": 150,
  "response": [
    {
      "bbox": [139, 267, 808, 713],
      "class_name": "person",
      "confidence": 0.9
    }
  ]
}
`}
          </code></pre>
          <p>When using <code>**kwargs</code>, you might extract specific parts of this data:</p>
          <ul>
            <li><code>frame</code>: The frame number (integer).</li>
            <li><code>response</code>: A list of detection results, where each result includes:</li>
            <ul>
              <li><code>bbox</code>: Bounding box coordinates (list of four integers).</li>
              <li><code>class_name</code>: The detected object's class (string).</li>
              <li><code>confidence</code>: The confidence score of the detection (float).</li>
            </ul>
          </ul>
        </div>
      )
    },
    {
      title: 'Implementing Your Own Function with **kwargs',
      content: (
        <div>
          <p>You can create your own functions using <code>**kwargs</code> by following the same pattern:</p>
          <pre><code>
{`def yourFunction(**kwargs):
    your_value = kwargs.get('your_key', default_value)
    print(f"Your message: {your_value}")
    return your_value

# Example usage:
data = {'your_key': your_value}
yourFunction(**data)
`}
          </code></pre>
          <p>Replace <code>yourFunction</code>, <code>your_key</code>, and <code>your_value</code> with your specific function name and arguments.</p>
        </div>
      )
    }
  ];

  return (
    <div className="walkthrough-modal">
      <div className="walkthrough-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>{steps[step].title}</h2>
        <div>{steps[step].content}</div>
        <div className="walkthrough-buttons">
          {step > 0 && (
            <button className="button" onClick={onPrevious}>Previous</button>
          )}
          {step < steps.length - 1 ? (
            <button className="button" onClick={onNext}>Next</button>
          ) : (
            <button className="button" onClick={onClose}>Got It</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalkthroughModal;
