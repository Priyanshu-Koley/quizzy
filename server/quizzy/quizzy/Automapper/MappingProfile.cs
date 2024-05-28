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
        }
    }

}
