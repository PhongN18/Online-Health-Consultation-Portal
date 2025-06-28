using System.ComponentModel.DataAnnotations.Schema;

namespace BackendOHCP.Models
{
    public enum CareOptionType
    {
        PrimaryCare,
        WomenHealth,
        MenHealth,
        ChildrenHealth,
        SexualHealth,
        ManageCondition,
        Wellness,
        TravelMedicine,
        SeniorHealth,
        MentalHealth
    }

    public class DoctorCareOption
    {
        public int DoctorProfileId { get; set; }
        public DoctorProfile DoctorProfile { get; set; } = null!;

        public CareOptionType CareOption { get; set; }
    }
}
