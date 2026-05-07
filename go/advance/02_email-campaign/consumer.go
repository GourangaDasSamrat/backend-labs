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

		msg,err:= executeTemplate(recipient)
		if err != nil {
			fmt.Printf("Worker :%d Error parsing template for %s",id, recipient.Email)
			// TODO: Add to dlq
			continue
		}

		fmt.Printf("Worker :%d Sending email %s\n", id, recipient.Email)

		err = smtp.SendMail(
			fmt.Sprintf("%s:%d", smtpHost, smtpPort),
			nil,
			"no-reply@gouranga.eu.org",
			[]string{recipient.Email},
			[]byte(msg),
		)

		if err != nil {
			log.Fatal(err)
		}

		time.Sleep(time.Millisecond * 50)

		fmt.Printf("Worker :%d Sent email %s\n", id, recipient.Email)
	}
}
