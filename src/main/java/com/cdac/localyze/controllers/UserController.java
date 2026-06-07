package com.cdac.localyze.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.localyze.entities.User;
import com.cdac.localyze.serviceI.UserServiceI;

@RestController
@RequestMapping("/api/users")
public class UserController {
	@Autowired
	private UserServiceI userService;
}
