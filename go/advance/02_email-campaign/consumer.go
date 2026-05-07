package main

import (
	"fmt"
	"log"
	"net/smtp"
	"sync"
	"time"
)

func emailWorker(id int, ch chan Recipient, wg *sync.WaitGroup) {
	defer wg.Done()

	for recipient := range ch {
		smtpHost := "localhost"
		smtpPort := 1025

		formattedMsg := fmt.Sprintf("To: %s\r\nSubject: Email Test\r\n\r\n%s\r\n", recipient.Email, "Just my email campaign")
		msg := []byte(formattedMsg)

		fmt.Printf("Worker %d: Sending email %s\n", id, recipient.Email)

		err := smtp.SendMail(
			fmt.Sprintf("%s:%d", smtpHost, smtpPort),
			nil,
			"no-reply@gouranga.eu.org",
			[]string{recipient.Email},
			msg,
		)

		if err != nil {
			log.Fatal(err)
		}

		time.Sleep(time.Millisecond * 50)

		fmt.Printf("Worker %d: Sent email %s\n", id, recipient.Email)
	}
}
