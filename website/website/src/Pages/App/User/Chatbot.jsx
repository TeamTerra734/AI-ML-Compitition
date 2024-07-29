import React, { useState } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMessage = { text: input, type: 'user' };
    setMessages([...messages, newMessage]);

    try {
      const response = await fetch('http://localhost:8000/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      const botMessage = { text: data.reply, type: 'bot' };
      setMessages([...messages, newMessage, botMessage]);
    } catch (error) {
      console.error('Error:', error);
    }

    setInput('');
  };

  return (
    <Container className="d-flex flex-column chat-container">
      <Row className="flex-grow-1 overflow-auto">
        <Col>
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                {msg.text}
              </div>
            ))}
          </div>
        </Col>
      </Row>
      <Form onSubmit={handleSubmit} className="message-form d-flex">
        <Form.Control
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          required
          className="me-2"
        />
        <Button type="submit" variant="primary">Send</Button>
      </Form>
    </Container>
  );
};

export default Chatbot;
