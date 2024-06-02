using AutoMapper;
using quizzy.Dtos;
using quizzy.Entities;

namespace quizzy.Automapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Quiz, GetQuizDto>()
            .ForMember(dest => dest.Questions, opt => opt.MapFrom(src => src.Questions.OrderBy(q => q.QuestionNo)));

            CreateMap<Question, GetQuestionDto>()
                .ForMember(dest => dest.Options, opt => opt.MapFrom(src => src.Options.OrderBy(o => o.OptionNo)));

            CreateMap<Option, GetOptionDto>();

            CreateMap<CreateQuizDto, Quiz>();
            CreateMap<QuestionDto, Question>();
            CreateMap<OptionDto, Option>();

            CreateMap<UpdateQuizDto, Quiz>();
            CreateMap<UpdateQuestionDto, Question>();
            CreateMap<UpdateOptionDto, Option>();

            CreateMap<StartQuizDto, Result>();
            CreateMap<SubmitQuizDto, Result>();

            CreateMap<SubmitQuizDto, Result>()
            .ForMember(dest => dest.ResultId, opt => opt.Ignore()) // Ignore ResultId during update
            .ForMember(dest => dest.UserId, opt => opt.Ignore()) // Ignore UserId during update
            .ForMember(dest => dest.QuizId, opt => opt.Ignore()) // Ignore QuizId during update
            .ForMember(dest => dest.TotalMarks, opt => opt.Ignore()); // Ignore TotalMarks during update

            CreateMap<AnswerDto, Answer>()
            .ForMember(dest => dest.AnswerId, opt => opt.Ignore()) // Ignore AnswerId during update
            .ForMember(dest => dest.Result, opt => opt.Ignore()) // Ignore navigation property
            .ForMember(dest => dest.Question, opt => opt.Ignore()) // Ignore navigation property
            .ForMember(dest => dest.Option, opt => opt.Ignore()) // Ignore navigation property
            .ForMember(dest => dest.AppUser, opt => opt.Ignore()) // Ignore navigation property
            .ForMember(dest => dest.Quiz, opt => opt.Ignore()); // Ignore navigation property

            CreateMap<Result, GetResultDto>();
            CreateMap<Answer, GetAnswerDto>();
        }
    }

}
