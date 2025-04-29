package com.fitsphere.service.impl;

import com.fitsphere.dto.ProgressUpdateDTO;
import com.fitsphere.dto.UserDTO;
import com.fitsphere.model.ProgressUpdate;
import com.fitsphere.model.User;
import com.fitsphere.repository.ProgressUpdateRepository;
import com.fitsphere.repository.UserRepository;
import com.fitsphere.service.ProgressUpdateService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgressUpdateServiceImpl implements ProgressUpdateService {

    private final ProgressUpdateRepository progressUpdateRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ProgressUpdateDTO createProgressUpdate(ProgressUpdateDTO progressUpdateDTO, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        ProgressUpdate progressUpdate = new ProgressUpdate();
        progressUpdate.setUser(user);
        progressUpdate.setTemplateType(progressUpdateDTO.getTemplateType());
        progressUpdate.setTitle(progressUpdateDTO.getTitle());
        progressUpdate.setDetails(progressUpdateDTO.getDetails());

        ProgressUpdate savedUpdate = progressUpdateRepository.save(progressUpdate);
        return convertToDTO(savedUpdate);
    }

    @Override
    @Transactional
    public ProgressUpdateDTO updateProgressUpdate(Long id, ProgressUpdateDTO progressUpdateDTO, Authentication authentication) {
        ProgressUpdate progressUpdate = progressUpdateRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Progress update not found"));

        User currentUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!progressUpdate.getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("Not authorized to update this progress update");
        }

        progressUpdate.setTemplateType(progressUpdateDTO.getTemplateType());
        progressUpdate.setTitle(progressUpdateDTO.getTitle());
        progressUpdate.setDetails(progressUpdateDTO.getDetails());

        ProgressUpdate updatedUpdate = progressUpdateRepository.save(progressUpdate);
        return convertToDTO(updatedUpdate);
    }

    @Override
    @Transactional
    public void deleteProgressUpdate(Long id, Authentication authentication) {
        ProgressUpdate progressUpdate = progressUpdateRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Progress update not found"));

        User currentUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!progressUpdate.getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("Not authorized to delete this progress update");
        }

        progressUpdateRepository.delete(progressUpdate);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProgressUpdateDTO> getProgressUpdatesByUserId(Long userId) {
        return progressUpdateRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProgressUpdateDTO getProgressUpdateById(Long id) {
        return progressUpdateRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new EntityNotFoundException("Progress update not found"));
    }

    private ProgressUpdateDTO convertToDTO(ProgressUpdate progressUpdate) {
        return new ProgressUpdateDTO(
                progressUpdate.getId(),
                progressUpdate.getUser().getId(),
                progressUpdate.getTemplateType(),
                progressUpdate.getTitle(),
                progressUpdate.getDetails(),
                progressUpdate.getCreatedAt(),
                progressUpdate.getUpdatedAt(),
                UserDTO.fromUser(progressUpdate.getUser())
        );
    }
} 