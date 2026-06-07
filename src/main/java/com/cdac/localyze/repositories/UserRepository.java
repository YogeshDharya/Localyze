package com.cdac.localyze.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import com.cdac.localyze.entities.User;

@Repository
public interface UserRepository extends JpaRepository<User,Long>{

}
